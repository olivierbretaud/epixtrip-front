import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "../../../../messages/fr.json";
import ResetPasswordForm from "./index";

const meta: Meta<typeof ResetPasswordForm> = {
  title: "Forms/ResetPasswordForm",
  component: ResetPasswordForm,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        searchParams: { token: "fake-reset-token" },
      },
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="fr" messages={messages}>
        <div className="flex p-5 items-center justify-center">
          <div className="w-96">
            <QueryClientProvider client={new QueryClient()}>
              <Story />
            </QueryClientProvider>
          </div>
        </div>
      </NextIntlClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ResetPasswordForm>;

const mockFetch = fn();

// ─── Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  beforeEach() {
    globalThis.fetch = mockFetch;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(
      canvas.getByLabelText("Confirmer le mot de passe"),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Réinitialiser" }),
    ).toBeInTheDocument();
  },
};

// ─── ValidationErrors ───────────────────────────────────────────────────────

export const ValidationErrors: Story = {
  beforeEach() {
    globalThis.fetch = mockFetch;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Réinitialiser" }),
    );

    const errors = await canvas.findAllByText("Le mot de passe est requis");
    expect(errors.length).toBeGreaterThanOrEqual(1);
  },
};

// ─── PasswordMismatch ────────────────────────────────────────────────────────

export const PasswordMismatch: Story = {
  beforeEach() {
    globalThis.fetch = mockFetch;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText("Mot de passe"), "Password1!");
    await userEvent.type(
      canvas.getByLabelText("Confirmer le mot de passe"),
      "Different1!",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Réinitialiser" }),
    );

    expect(
      await canvas.findByText("Les mots de passe ne correspondent pas"),
    ).toBeInTheDocument();
  },
};

// ─── Loading ─────────────────────────────────────────────────────────────────

export const Loading: Story = {
  beforeEach() {
    globalThis.fetch = mockFetch;
    mockFetch.mockReturnValue(new Promise(() => {}));
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText("Mot de passe"), "Password1!");
    await userEvent.type(
      canvas.getByLabelText("Confirmer le mot de passe"),
      "Password1!",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Réinitialiser" }),
    );

    expect(await canvas.findByText("Réinitialisation…")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Réinitialisation…" }),
    ).toBeDisabled();
  },
};

// ─── Success ─────────────────────────────────────────────────────────────────

export const Success: Story = {
  beforeEach() {
    globalThis.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ message: "Mot de passe réinitialisé" }),
    });
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText("Mot de passe"), "Password1!");
    await userEvent.type(
      canvas.getByLabelText("Confirmer le mot de passe"),
      "Password1!",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Réinitialiser" }),
    );

    expect(
      await canvas.findByText("Votre mot de passe a été réinitialisé."),
    ).toBeInTheDocument();
  },
};

// ─── ApiError ────────────────────────────────────────────────────────────────

export const ApiError: Story = {
  beforeEach() {
    globalThis.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: async () => ({ message: "Token invalide ou expiré" }),
    });
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText("Mot de passe"), "Password1!");
    await userEvent.type(
      canvas.getByLabelText("Confirmer le mot de passe"),
      "Password1!",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Réinitialiser" }),
    );

    expect(
      await canvas.findByText("Token invalide ou expiré"),
    ).toBeInTheDocument();
  },
};
