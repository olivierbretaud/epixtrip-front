import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useForm } from "react-hook-form";
import { expect, userEvent, within } from "storybook/test";
import { InputText } from "./index";

const meta: Meta<typeof InputText> = {
  title: "UI/Inputs/InputText",
  component: InputText,
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
type Story = StoryObj<typeof InputText>;

function Wrapper(
  props: Omit<React.ComponentProps<typeof InputText>, "registration">,
) {
  const { register } = useForm<{ text: string }>();
  return (
    <div className="w-80">
      <InputText {...props} registration={register("text")} />
    </div>
  );
}

function WrapperWithError(
  props: Omit<React.ComponentProps<typeof InputText>, "registration" | "error">,
) {
  const { register } = useForm<{ text: string }>();
  return (
    <div className="w-80">
      <InputText
        {...props}
        registration={register("text")}
        error={{ type: "required", message: "Ce champ est requis" }}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Wrapper label="Titre" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText("Titre");
    expect(label).toBeInTheDocument();

    const input = canvas.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).not.toBeDisabled();
  },
};

export const Types: Story = {
  render: () => <Wrapper label="Titre" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await userEvent.click(input);
    await userEvent.type(input, "Mon voyage à Paris");

    expect(input).toHaveValue("Mon voyage à Paris");
  },
};

export const CustomPlaceholder: Story = {
  render: () => <Wrapper label="Titre" placeholder="Ex: Mon voyage..." />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "Ex: Mon voyage...");
  },
};

export const WithError: Story = {
  render: () => <WrapperWithError label="Titre" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const errorMessage = canvas.getByText("Ce champ est requis");
    expect(errorMessage).toBeInTheDocument();

    const input = canvas.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  },
};

export const Disabled: Story = {
  render: () => <Wrapper label="Titre" disabled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    expect(input).toBeDisabled();
    expect(input).toHaveValue("");
  },
};
