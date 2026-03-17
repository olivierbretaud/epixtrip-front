import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogOut } from "lucide-react";
import { expect, within } from "storybook/test";
import { Button } from ".";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "icon"],
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Bouton",
    variant: "default",
    size: "md",
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="flex p-5 items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Button>;

// ─── Variants ────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole("button", { name: "Bouton" });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Supprimer" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const Icon: Story = {
  args: {
    size: "icon",
    variant: "ghost",
    "aria-label": "Se déconnecter",
    children: <LogOut />,
  },
};

// ─── States ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button")).toBeDisabled();
  },
};

export const Loading: Story = {
  args: { disabled: true, children: "Connexion…" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole("button", { name: "Connexion…" });
    expect(btn).toBeDisabled();
  },
};
