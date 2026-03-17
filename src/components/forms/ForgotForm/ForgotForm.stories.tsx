import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "../../../../messages/fr.json";
import ForgotForm from "./index";

const meta: Meta<typeof ForgotForm> = {
  title: "Forms/ForgotForm",
  component: ForgotForm,
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
type Story = StoryObj<typeof ForgotForm>;

const mockFetch = fn();

// ─── Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  beforeEach() {
    globalThis.fetch = mockFetch;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByLabelText("Email")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Demande de réinitialisation" }),
    ).toBeInTheDocument();
  },
};

// ─── ValidationError ────────────────────────────────────────────────────────

export const ValidationError: Story = {
  beforeEach() {
    globalThis.fetch = mockFetch;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Demande de réinitialisation" }),
    );

    expect(await canvas.findByText("L'email est requis")).toBeInTheDocument();
  },
};

// ─── InvalidEmail ────────────────────────────────────────────────────────────

export const InvalidEmail: Story = {
  beforeEach() {
    globalThis.fetch = mockFetch;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText("Email"), "not-an-email");
    await userEvent.click(
      canvas.getByRole("button", { name: "Demande de réinitialisation" }),
    );

    expect(await canvas.findByText("Email invalide")).toBeInTheDocument();
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
    await userEvent.click(
      canvas.getByRole("button", { name: "Demande de réinitialisation" }),
    );

    expect(await canvas.findByText("Demande en cours")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Demande en cours" }),
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
      json: async () => ({ message: "Email envoyé" }),
    });
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText("Email"), "test@example.com");
    await userEvent.click(
      canvas.getByRole("button", { name: "Demande de réinitialisation" }),
    );

    expect(
      await canvas.findByText(
        "Si un compte est associé à cet e-mail, un lien de réinitialisation vous a été envoyé.",
      ),
    ).toBeInTheDocument();
  },
};

// ─── ApiError ────────────────────────────────────────────────────────────────

export const ApiError: Story = {
  beforeEach() {
    globalThis.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
      json: async () => ({
        message: "Trop de tentatives, réessayez plus tard",
      }),
    });
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText("Email"), "test@example.com");
    await userEvent.click(
      canvas.getByRole("button", { name: "Demande de réinitialisation" }),
    );

    expect(
      await canvas.findByText("Trop de tentatives, réessayez plus tard"),
    ).toBeInTheDocument();
  },
};
