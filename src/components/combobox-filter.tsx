"use client";

import { useState } from "react";

import { ChevronsUpDown, X } from "lucide-react";

import {
  PopoverContent,
  PopoverTrigger,
  Popover,
} from "@/components/ui/popover";
import { CommandGroup, CommandItem, Command } from "@/components/ui/command";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface ComboboxFilterProps<T extends string> {
  value?: T | null;
  items: ReadonlyArray<{ value: T; label: string; disabled?: boolean }>;
  placeholder: string;
  onChange: (value: T | "") => void;
  className?: string;
  disabled?: boolean;
}

export function ComboboxFilter<T extends string>({
  value,
  items,
  placeholder,
  onChange,
  className,
  disabled,
}: Readonly<ComboboxFilterProps<T>>) {
  const [open, setOpen] = useState(false);
  const selectedItem = items.find((item) => item.value === value);

  return (
    <div className="relative">
      <Popover onOpenChange={disabled ? undefined : setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "justify-between gap-2",
              selectedItem && "pr-8",
              disabled && "opacity-50 cursor-not-allowed",
              className,
            )}
            aria-expanded={open}
            disabled={disabled}
            variant="outline"
            role="combobox"
          >
            <span className="truncate">
              {selectedItem?.label ?? placeholder}
            </span>
            <ChevronsUpDown
              className={cn(
                "size-4 shrink-0",
                disabled ? "opacity-30" : "opacity-50",
              )}
            />
          </Button>
        </PopoverTrigger>
        {!disabled && (
          <PopoverContent className="w-fit p-0" align="start">
            <Command>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    className={cn(
                      "cursor-pointer",
                      item.value === value ? "font-bold bg-accent" : "",
                      item.disabled ? "opacity-50 cursor-not-allowed" : "",
                    )}
                    disabled={item.disabled}
                    onSelect={() => {
                      if (!item.disabled) {
                        onChange(item.value === value ? "" : item.value);
                        setOpen(false);
                      }
                    }}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        )}
      </Popover>
      {selectedItem && !disabled && (
        <Button
          className="absolute right-0 top-0 h-full px-2 hover:bg-accent"
          size="icon"
          variant="ghost"
          onClick={() => onChange("")}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
