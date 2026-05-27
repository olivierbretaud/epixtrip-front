import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/lang/fr.json";
import TravelForm from "./index";

const meta: Meta<typeof TravelForm> = {
  title: "Travel/TravelForm",
  component: TravelForm,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="fr" messages={messages}>
        <div className="flex p-5 items-center justify-center">
          <div className="w-120">
            <Story />
          </div>
        </div>
      </NextIntlClientProvider>
    ),
  ],
  args: {
    onSubmit: fn(),
    cancel: fn(),
    isPending: false,
    defaultValues: {},
    deleteTravel: null,
  },
};

export default meta;
type Story = StoryObj<typeof TravelForm>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("textbox", { name: /titre/i })).toBeInTheDocument();
    expect(
      canvas.getByRole("textbox", { name: /description/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /sauvegarder/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /annuler/i }),
    ).toBeInTheDocument();
  },
};

export const WithDefaultValues: Story = {
  args: {
    defaultValues: {
      title: "Road trip en Islande",
      description: "Un voyage inoubliable à travers les fjords et volcans.",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("textbox", { name: /titre/i })).toHaveValue(
      "Road trip en Islande",
    );
    expect(canvas.getByRole("textbox", { name: /description/i })).toHaveValue(
      "Un voyage inoubliable à travers les fjords et volcans.",
    );
  },
};

export const WithDelete: Story = {
  args: {
    defaultValues: {
      title: "Road trip en Islande",
      description: "Un voyage inoubliable à travers les fjords et volcans.",
    },
    deleteTravel: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      canvas.getByRole("button", { name: /supprimer/i }),
    ).toBeInTheDocument();
  },
};

export const Pending: Story = {
  args: {
    isPending: true,
    deleteTravel: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("button", { name: /sauvegarder/i })).toBeDisabled();
    expect(canvas.getByRole("button", { name: /annuler/i })).toBeDisabled();
    expect(canvas.getByRole("button", { name: /supprimer/i })).toBeDisabled();
  },
};

export const ValidationErrors: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: /sauvegarder/i }));

    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const Submit: Story = {
  args: {
    defaultValues: {
      title: "Road trip en Islande",
      description: "Un voyage inoubliable.",
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: /sauvegarder/i }));

    await waitFor(() => {
      expect(args.onSubmit).toHaveBeenCalledWith(
        {
          title: "Road trip en Islande",
          description: "Un voyage inoubliable.",
        },
        expect.any(Object),
      );
    });
  },
};
