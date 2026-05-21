import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useForm } from "react-hook-form";
import { expect, userEvent, within } from "storybook/test";
import { InputTextarea } from "./index";

const meta: Meta<typeof InputTextarea> = {
  title: "UI/Inputs/InputTextarea",
  component: InputTextarea,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex p-5 items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InputTextarea>;

function Wrapper(
  props: Omit<React.ComponentProps<typeof InputTextarea>, "registration">,
) {
  const { register } = useForm<{ text: string }>();
  return (
    <div className="w-80">
      <InputTextarea {...props} registration={register("text")} />
    </div>
  );
}

function WrapperWithError(
  props: Omit<
    React.ComponentProps<typeof InputTextarea>,
    "registration" | "error"
  >,
) {
  const { register } = useForm<{ text: string }>();
  return (
    <div className="w-80">
      <InputTextarea
        {...props}
        registration={register("text")}
        error={{ type: "required", message: "Ce champ est requis" }}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Wrapper label="Description" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText("Description");
    expect(label).toBeInTheDocument();

    const textarea = canvas.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
    expect(textarea).not.toBeDisabled();
  },
};

export const Types: Story = {
  render: () => <Wrapper label="Description" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");

    await userEvent.click(textarea);
    await userEvent.type(textarea, "Une description sur plusieurs\nlignes.");

    expect(textarea).toHaveValue("Une description sur plusieurs\nlignes.");
  },
};

export const CustomPlaceholder: Story = {
  render: () => (
    <Wrapper label="Description" placeholder="Décrivez votre voyage..." />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");
    expect(textarea).toHaveAttribute(
      "placeholder",
      "Décrivez votre voyage...",
    );
  },
};

export const CustomRows: Story = {
  render: () => <Wrapper label="Description" rows={8} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");
    expect(textarea).toHaveAttribute("rows", "8");
  },
};

export const WithError: Story = {
  render: () => <WrapperWithError label="Description" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const errorMessage = canvas.getByText("Ce champ est requis");
    expect(errorMessage).toBeInTheDocument();

    const textarea = canvas.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  },
};

export const Disabled: Story = {
  render: () => <Wrapper label="Description" disabled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveValue("");
  },
};
