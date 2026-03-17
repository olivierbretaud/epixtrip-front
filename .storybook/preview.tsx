import type { Preview, StoryContext } from "@storybook/nextjs-vite";
import {
  Lora,
  Plus_Jakarta_Sans,
  Roboto_Mono,
  Yeseva_One,
} from "next/font/google";
import "../src/styles/globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});
const fontSerif = Lora({ subsets: ["latin"], variable: "--font-serif" });
const fontMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" });
const fontDisplay = Yeseva_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const fontClasses = [
  fontSans.variable,
  fontSerif.variable,
  fontMono.variable,
  fontDisplay.variable,
].join(" ");

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Thème global",
      toolbar: {
        title: "Thème",
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context: StoryContext) => (
      <div className={context.globals.theme === "dark" ? "dark" : ""}>
        <div className={`${fontClasses} bg-background text-foreground`}>
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
