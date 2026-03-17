import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useForm } from "react-hook-form";
import { expect, userEvent, within } from "storybook/test";
import { InputPassword } from "./InputPassword";

const meta: Meta<typeof InputPassword> = {
  title: "UI/Inputs/InputPassword",
  component: InputPassword,
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
type Story = StoryObj<typeof InputPassword>;

function Wrapper(
  props: Omit<React.ComponentProps<typeof InputPassword>, "registration">,
) {
  const { register } = useForm<{ password: string }>();
  return (
    <div className="w-80">
      <InputPassword {...props} registration={register("password")} />
    </div>
  );
}

function WrapperWithValidation(
  props: Omit<
    React.ComponentProps<typeof InputPassword>,
    "registration" | "error"
  >,
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>();

  return (
    <form
      className="flex w-80 flex-col gap-4"
      onSubmit={handleSubmit(() => {})}
    >
      <InputPassword
        {...props}
        registration={register("password", {
          validate: {
            uppercase: (v) =>
              /[A-Z]/.test(v) || "At least one uppercase letter",
            lowercase: (v) =>
              /[a-z]/.test(v) || "At least one lowercase letter",
            number: (v) => /[0-9]/.test(v) || "At least one number",
            special: (v) =>
              /[^A-Za-z0-9]/.test(v) || "At least one special character",
          },
        })}
        error={errors.password}
      />
      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Valider
      </button>
    </form>
  );
}

function WrapperWithError(
  props: Omit<
    React.ComponentProps<typeof InputPassword>,
    "registration" | "error"
  >,
) {
  const { register } = useForm<{ password: string }>();
  return (
    <div className="w-80">
      <InputPassword
        {...props}
        registration={register("password")}
        error={{ type: "minLength", message: "8 caractères minimum" }}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Wrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Mot de passe")).toBeInTheDocument();

    const input = canvas.getByLabelText("Mot de passe");
    expect(input).toHaveAttribute("type", "password");
    expect(input).not.toBeDisabled();
  },
};

export const TypesPassword: Story = {
  render: () => <Wrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Mot de passe");

    await userEvent.click(input);
    await userEvent.type(input, "monmotdepasse");

    expect(input).toHaveValue("monmotdepasse");
    expect(input).toHaveAttribute("type", "password");
  },
};

export const ToggleVisibility: Story = {
  render: () => <Wrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Mot de passe");
    const toggleBtn = canvas.getByRole("button", {
      name: "Afficher le mot de passe",
    });

    expect(input).toHaveAttribute("type", "password");

    await userEvent.click(toggleBtn);
    expect(input).toHaveAttribute("type", "text");
    expect(
      canvas.getByRole("button", { name: "Masquer le mot de passe" }),
    ).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Masquer le mot de passe" }),
    );
    expect(input).toHaveAttribute("type", "password");
  },
};

export const WithError: Story = {
  render: () => <WrapperWithError />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("8 caractères minimum")).toBeInTheDocument();

    const input = canvas.getByLabelText("Mot de passe");
    expect(input).toHaveAttribute("aria-invalid", "true");
  },
};

export const Disabled: Story = {
  render: () => <Wrapper disabled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Mot de passe");

    expect(input).toBeDisabled();
    expect(
      canvas.getByRole("button", { name: "Afficher le mot de passe" }),
    ).toBeDisabled();
  },
};

export const WithValidation: Story = {
  render: () => <WrapperWithValidation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Mot de passe");
    const submit = canvas.getByRole("button", { name: "Valider" });

    // Mot de passe invalide → affiche la première erreur
    await userEvent.type(input, "abc");
    await userEvent.click(submit);
    expect(
      canvas.getByText("At least one uppercase letter"),
    ).toBeInTheDocument();

    // Mot de passe valide → plus d'erreur
    await userEvent.clear(input);
    await userEvent.type(input, "Abcd1@ef");
    await userEvent.click(submit);
    expect(
      canvas.queryByText("At least one uppercase letter"),
    ).not.toBeInTheDocument();
  },
};

export const CustomLabel: Story = {
  render: () => <Wrapper label="Confirmer le mot de passe" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Confirmer le mot de passe")).toBeInTheDocument();
  },
};
