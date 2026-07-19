export type NavigationItem = {
  label: string;
  href: `/${string}`;
  children?: NavigationItem[];
};

export const navigation: NavigationItem[] = [
  {
    label: "OrchTools",
    href: "/orchtools",
    children: [
      { label: "BRSOfriend", href: "/orchtools-brsofriend" },
      { label: "KontaktCutter", href: "/orchtools-kontaktcutter" },
      { label: "준비 중", href: "/orchtools-ot3" },
    ],
  },
  {
    label: "ProdTools",
    href: "/prodtools",
    children: [
      { label: "MixerPalette", href: "/prodtools-mixerpalette" },
      { label: "준비 중", href: "/prodtools-pt2" },
      { label: "준비 중", href: "/prodtools-pt3" },
    ],
  },
  {
    label: "MyBlog",
    href: "/myblog",
    children: [
      { label: "MySong", href: "/myblog-mysong" },
      { label: "MyTips", href: "/myblog-mytips" },
      { label: "History", href: "/myblog-history" },
    ],
  },
  { label: "Contributors", href: "/contributors" },
  { label: "Contact", href: "/contact" },
];
