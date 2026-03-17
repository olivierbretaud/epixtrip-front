import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useForm } from "react-hook-form";
import { expect, userEvent, within } from "storybook/test";
import { InputEmail } from "./InputEmail";

const meta: Meta<typeof InputEmail> = {
  title: "UI/Inputs/InputEmail",
  component: InputEmail,
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
type Story = StoryObj<typeof InputEmail>;

function Wrapper(
  props: Omit<React.ComponentProps<typeof InputEmail>, "registration">,
) {
  const { register } = useForm<{ email: string }>();
  return (
    <div className="w-80">
      <InputEmail {...props} registration={register("email")} />
    </div>
  );
}

function WrapperWithError(
  props: Omit<
    React.ComponentProps<typeof InputEmail>,
    "registration" | "error"
  >,
) {
  const { register } = useForm<{ email: string }>();
  return (
    <div className="w-80">
      <InputEmail
        {...props}
        registration={register("email")}
        error={{ type: "required", message: "L'adresse email est requise" }}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Wrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText("Email");
    expect(label).toBeInTheDocument();

    const input = canvas.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
    expect(input).not.toBeDisabled();
  },
};

export const TypesEmail: Story = {
  render: () => <Wrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await userEvent.click(input);
    await userEvent.type(input, "test@example.com");

    expect(input).toHaveValue("test@example.com");
  },
};

export const CustomLabel: Story = {
  render: () => <Wrapper label="Adresse email" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Adresse email")).toBeInTheDocument();
  },
};

export const CustomPlaceholder: Story = {
  render: () => <Wrapper placeholder="votre@email.com" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "votre@email.com");
  },
};

export const WithError: Story = {
  render: () => <WrapperWithError />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const errorMessage = canvas.getByText("L'adresse email est requise");
    expect(errorMessage).toBeInTheDocument();

    const input = canvas.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  },
};

export const Disabled: Story = {
  render: () => <Wrapper disabled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    expect(input).toBeDisabled();
    expect(input).toHaveValue("");
  },
};
