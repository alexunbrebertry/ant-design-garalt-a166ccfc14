import * as React from 'react';
import { CheckOutlined, CopyOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, ConfigProvider, Flex, theme, Tooltip, Typography } from 'antd';
import { createStyles } from 'antd-style';
import copy from 'antd/lib/_util/copy';
import clsx from 'clsx';

import { DarkContext } from '../../../../hooks/useDark';
import useLocale from '../../../../hooks/useLocale';
import Group from '../Group';
import ComponentsBlock from './ComponentsBlock';
import usePreviewThemes from './previewThemes';
import type { PreviewThemeConfig } from './previewThemes';
import { generateFullCopyFile } from './themeCodeUtils';

const { Text } = Typography;

const locales = {
  cn: {
    themeTitle: '定制主题，随心所欲',
    themeDesc: '开放样式算法与语义化结构，让你与 AI 一起轻松定制主题',
    aiGenerate: 'AI 生成',
    aiGenerateDesc: '用一句话描述你想要的风格',
    copyTheme: '复制主题代码',
    copySuccess: '已复制',
    exploreThemes: '探索主题',
  },
  en: {
    themeTitle: 'Flexible theme customization',
    themeDesc:
      'Open style algorithms and semantic structures make it easy for you and AI to customize themes',
    aiGenerate: 'AI Generate',
    aiGenerateDesc: 'Describe your desired style',
    copyTheme: 'Copy theme code',
    copySuccess: 'Copied',
    exploreThemes: 'Explore Themes',
  },
};

// 每个预设主题对应的图标 emoji 和图标盒背景色
const THEME_ICON_MAP: Record<string, { icon: string; iconBg: string }> = {
  light: { icon: '☀️', iconBg: '#F2EEFF' },
  dark: { icon: '🌙', iconBg: '#2B2D3A' },
  default: { icon: '☀️', iconBg: '#F2EEFF' },
  mui: { icon: '🎨', iconBg: '#EBF5FE' },
  shadcn: { icon: '◻️', iconBg: '#F5F5F5' },
  cartoon: { icon: '🎪', iconBg: '#FFF7E6' },
  illustration: { icon: '🖼️', iconBg: '#F0F9FF' },
  // bootstrap: { icon: '🅱️', iconBg: '#F0EDFF' },
  // glass: { icon: '💎', iconBg: '#E6F7FF' },
  // geek: { icon: '⚙️', iconBg: '#1A1A2E' },
};

const FALLBACK_ICON = { icon: '✦', iconBg: '#F5F5F5' };

function getThemeIcon(previewTheme: PreviewThemeConfig) {
  if (previewTheme.key && THEME_ICON_MAP[previewTheme.key]) {
    return THEME_ICON_MAP[previewTheme.key];
  }
  // 在 name 中尝试匹配关键词
  const nameLower = previewTheme.name.toLowerCase();
  for (const [key, value] of Object.entries(THEME_ICON_MAP)) {
    if (nameLower.includes(key)) {
      return value;
    }
  }
  return FALLBACK_ICON;
}

const useStyles = createStyles(({ css, token }) => ({
  container: css({
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  }),

  // ======= 顶部主题选择区域 =======
  selectorRow: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: token.paddingLG,
    marginBottom: token.paddingLG,
    flexWrap: 'wrap',
  }),

  selectorHeader: css({
    display: 'flex',
    alignItems: 'center',
    gap: token.paddingSM,
    flexShrink: 0,
  }),

  selectorTitle: css({
    fontSize: token.fontSizeLG,
    fontWeight: 600,
    color: token.colorText,
    whiteSpace: 'nowrap',
  }),

  selectorArrow: css({
    fontSize: 24,
    color: token.colorPrimary,
    lineHeight: 1,
    transform: 'rotate(45deg)',
    display: 'inline-block',
  }),

  themeList: css({
    display: 'flex',
    gap: token.paddingMD,
    flexWrap: 'wrap',
    alignItems: 'center',
  }),

  // 每一个主题 icon 卡
  themeCard: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: token.paddingXS,
    cursor: 'pointer',
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    borderRadius: token.borderRadiusLG,
    transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
    outline: 'none',

    '&:hover:not(.active)': {
      backgroundColor: token.colorFillQuaternary,
    },

    '&:focus-visible': {
      outline: `2px solid ${token.colorPrimary}`,
      outlineOffset: 2,
    },

    '&.dark-bg': {
      '&:hover:not(.active)': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },
    },
  }),

  themeIconBox: css({
    width: 64,
    height: 64,
    borderRadius: token.borderRadiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    border: `2px solid transparent`,
    transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
    position: 'relative',
    overflow: 'hidden',

    '&.active': {
      borderColor: token.colorPrimary,
      boxShadow: `0 0 0 1px ${token.colorPrimary}`,
    },
  }),

  themeLabel: css({
    fontSize: token.fontSizeSM,
    color: token.colorTextSecondary,
    transition: `color ${token.motionDurationMid}`,
    textAlign: 'center',
    maxWidth: 72,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',

    '&.active': {
      color: token.colorPrimary,
      fontWeight: 600,
    },

    '&.dark-bg': {
      color: 'rgba(255, 255, 255, 0.65)',

      '&.active': {
        color: '#fff',
        fontWeight: 600,
      },
    },
  }),

  copyButtonWrap: css({
    position: 'absolute',
    top: 4,
    insetInlineEnd: 4,
    opacity: 0,
    transition: `opacity ${token.motionDurationMid}`,

    '.ant-theme-card:hover &, &.visible': {
      opacity: 1,
    },
  }),

  // AI Generate card — dashed style
  aiThemeCard: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: token.paddingXS,
    cursor: 'pointer',
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    borderRadius: token.borderRadiusLG,
    outline: 'none',
    transition: `background ${token.motionDurationMid}`,
    opacity: 0.75,

    '&:hover': {
      opacity: 1,
      backgroundColor: token.colorFillQuaternary,
    },

    '&:focus-visible': {
      outline: `2px solid ${token.colorPrimary}`,
      outlineOffset: 2,
    },
  }),

  aiIconBox: css({
    width: 64,
    height: 64,
    borderRadius: token.borderRadiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px dashed ${token.colorBorder}`,
    backgroundColor: token.colorFillQuaternary,
    color: token.colorTextTertiary,
    fontSize: 22,
    transition: `all ${token.motionDurationMid}`,

    '&:hover': {
      borderColor: token.colorPrimary,
      color: token.colorPrimary,
    },
  }),

  // ======= 组件预览区域 =======
  componentsBlockContainer: css({
    flex: 'auto',
    display: 'flex',
    padding: token.paddingXL,
    margin: '0 auto',
    marginTop: token.marginLG,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 650,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: 16,
    backgroundColor: token.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(12px)',
    boxShadow: token.boxShadowTertiary,
    overflow: 'hidden',
    width: '100%',
  }),

  componentsBlock: css({
    flex: 'auto',
    width: '100%',
    maxWidth: 1320,
    margin: '0 auto',
  }),
}));

export interface ThemePreviewProps {
  onOpenPromptDrawer?: () => void;
}

function ThemePreviewContent(props: ThemePreviewProps) {
  const { onOpenPromptDrawer } = props;
  const [locale] = useLocale(locales);
  const { styles } = useStyles();
  const isDark = React.use(DarkContext);
  const { message } = App.useApp();
  const { token } = theme.useToken();

  const previewThemes = usePreviewThemes();

  const [activeName, setActiveName] = React.useState(() => previewThemes[0].name);
  const [copiedName, setCopiedName] = React.useState<string | null>(null);
  const [hoveredName, setHoveredName] = React.useState<string | null>(null);
  const copyTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const defaultThemeName = isDark ? 'dark' : 'light';
    const targetTheme =
      previewThemes.find((previewTheme) => previewTheme.key === defaultThemeName)?.name ||
      previewThemes[0].name;
    setActiveName(targetTheme);
  }, [isDark]);

  const backgroundPrefetchList = React.useMemo(
    () => previewThemes.map((t) => t.bgImg).filter((img): img is string => !!img),
    [previewThemes],
  );

  const handleThemeClick = (name: string) => setActiveName(name);

  const handleKeyDown = (event: React.KeyboardEvent, name: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleThemeClick(name);
    }
  };

  const handleCopyTheme = async (event: React.MouseEvent, previewTheme: PreviewThemeConfig) => {
    event.stopPropagation();
    const code = generateFullCopyFile({
      themeConfig: previewTheme.props?.theme,
      copyCode: previewTheme.copyCode,
    });
    const success = await copy(code);
    if (success) {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
      setCopiedName(previewTheme.name);
      message.success(locale.copySuccess);
      copyTimerRef.current = setTimeout(() => setCopiedName(null), 2000);
    }
  };

  React.useEffect(
    () => () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    },
    [],
  );

  const activeTheme = previewThemes.find((previewTheme) => previewTheme.name === activeName);
  const isDarkBg = !!activeTheme?.bgImgDark;

  return (
    <Group
      title={locale.themeTitle}
      description={locale.themeDesc}
      background={activeTheme?.bgImg}
      collapse
      titleColor={isDarkBg ? '#fff' : undefined}
      backgroundPrefetchList={backgroundPrefetchList}
    >
      <Flex className={styles.container} gap={token.paddingLG}>
        {/* ===== 顶部：横排主题卡片选择器 ===== */}
        <div className={styles.selectorRow}>
          {/* 区域标题 */}
          <div className={styles.selectorHeader}>
            <span className={styles.selectorTitle}>{locale.exploreThemes}</span>
            <span className={styles.selectorArrow} aria-hidden>
              ↗
            </span>
          </div>

          {/* 主题卡片列表 */}
          <div className={styles.themeList} role="tablist" aria-label="Theme selection">
            {previewThemes.map((previewTheme) => {
              const isActive = activeName === previewTheme.name;
              const isHovered = hoveredName === previewTheme.name;
              const isCopied = copiedName === previewTheme.name;
              const { icon, iconBg } = getThemeIcon(previewTheme);

              return (
                <div
                  key={previewTheme.name}
                  className={clsx(styles.themeCard, isActive && 'active', isDarkBg && 'dark-bg')}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  aria-selected={isActive}
                  onClick={() => handleThemeClick(previewTheme.name)}
                  onKeyDown={(e) => handleKeyDown(e, previewTheme.name)}
                  onMouseEnter={() => setHoveredName(previewTheme.name)}
                  onMouseLeave={() => setHoveredName(null)}
                >
                  {/* 图标盒子 */}
                  <div
                    className={clsx(styles.themeIconBox, isActive && 'active')}
                    style={{ backgroundColor: iconBg }}
                  >
                    <span role="img" aria-label={previewTheme.name}>
                      {icon}
                    </span>
                    {/* 悬停时显示的复制按钮 */}
                    {(isHovered || isCopied) && (
                      <Tooltip title={locale.copyTheme}>
                        <Button
                          className={styles.copyButtonWrap}
                          style={{ opacity: 1 }}
                          type="text"
                          size="small"
                          icon={isCopied ? <CheckOutlined /> : <CopyOutlined />}
                          onClick={(e) => handleCopyTheme(e, previewTheme)}
                          aria-label={locale.copyTheme}
                        />
                      </Tooltip>
                    )}
                  </div>
                  {/* 标签 */}
                  <Text
                    className={clsx(
                      styles.themeLabel,
                      isActive && 'active',
                      isDarkBg && 'dark-bg',
                    )}
                  >
                    {previewTheme.name}
                  </Text>
                </div>
              );
            })}

            {/* AI 生成主题 — 占位末尾卡片 */}
            <div
              className={clsx(styles.aiThemeCard, isDarkBg && 'dark-bg')}
              role="tab"
              tabIndex={0}
              onClick={onOpenPromptDrawer}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenPromptDrawer?.();
                }
              }}
            >
              <Tooltip title={locale.aiGenerateDesc} placement="bottom">
                <div className={styles.aiIconBox}>
                  <PlusOutlined />
                </div>
              </Tooltip>
              <Text className={clsx(styles.themeLabel, isDarkBg && 'dark-bg')}>
                {locale.aiGenerate}
              </Text>
            </div>
          </div>
        </div>

        {/* ===== 组件预览区域 ===== */}
        <ComponentsBlock
          key={activeName}
          config={activeTheme?.props}
          className={styles.componentsBlock}
          containerClassName={styles.componentsBlockContainer}
        />
      </Flex>
    </Group>
  );
}

export default function ThemePreview(props: ThemePreviewProps = {}) {
  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <App>
        <ThemePreviewContent {...props} />
      </App>
    </ConfigProvider>
  );
}
