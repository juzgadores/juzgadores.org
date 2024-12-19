"use client";

import { LuMail } from "react-icons/lu";

import SpeedDial from "@/components/animata/fabs/speed-dial";

interface FooterActionsProps {
  contactEmail?: string;
}

export function FooterActions({ contactEmail }: FooterActionsProps) {
  const actions = [];

  if (contactEmail) {
    actions.push({
      icon: <LuMail className="size-4" />,
      label: contactEmail,
      key: contactEmail,
      action: () => {
        window.open(`${contactEmail}`, "_blank");
      },
    });
  }

  return <SpeedDial actionButtons={actions} direction="left" />;
}
