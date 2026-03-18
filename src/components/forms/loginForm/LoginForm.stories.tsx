import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/lang/fr.json";
import LoginForm from "./index";

const meta: Meta<typeof LoginForm> = {
  title: "Forms/LoginForm",
  component: LoginForm,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
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
type Story = StoryObj<typeof LoginForm>;

const mockFetch = fn();

// ─── Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  beforeEach() {
    globalThis.fetch = mockFetch;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByLabelText("Email")).toBeInTheDocument();
    expect(canvas.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Se connecter" }),
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

    await userEvent.click(canvas.getByRole("button", { name: "Se connecter" }));

    expect(await canvas.findByText("L'email est requis")).toBeInTheDocument();
    expect(
      await canvas.findByText("Le mot de passe est requis"),
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

    await userEvent.type(canvas.getByLabelText("Email"), "test@example.com");
    await userEvent.type(canvas.getByLabelText("Mot de passe"), "Password1!");
    await userEvent.click(canvas.getByRole("button", { name: "Se connecter" }));

    expect(await canvas.findByText("toto Connexion…")).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Connexion…" })).toBeDisabled();
  },
};

// ─── ApiError ────────────────────────────────────────────────────────────────

export const ApiError: Story = {
  beforeEach() {
    globalThis.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({ message: "Invalid credentials" }),
    });
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText("Email"), "test@example.com");
    await userEvent.type(canvas.getByLabelText("Mot de passe"), "Password1!");
    await userEvent.click(canvas.getByRole("button", { name: "Se connecter" }));

    expect(
      await canvas.findByText("Identifiants invalides"),
    ).toBeInTheDocument();
  },
};
