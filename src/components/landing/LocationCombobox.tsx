import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LocationOption {
  value: string;
  label: string;
  code?: string;
}

interface LocationComboboxProps {
  options: LocationOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  disabled?: boolean;
  showCode?: boolean;
}

export function LocationCombobox({
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled = false,
  showCode = false,
}: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const selectedOption = options.find((option) => option.value === value);

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options;
    
    const query = searchQuery.toLowerCase().trim();
    return options.filter((option) => {
      const labelMatch = option.label.toLowerCase().includes(query);
      const codeMatch = option.code?.includes(query);
      return labelMatch || codeMatch;
    });
  }, [options, searchQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between min-h-[55px] h-auto py-3 px-4",
            "text-base md:text-lg font-medium",
            "border-2 border-border/60 hover:border-gold/50 focus:border-gold",
            "bg-background hover:bg-muted/30",
            "shadow-sm hover:shadow-md transition-all duration-200",
            "rounded-xl",
            !value && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed bg-muted/50"
          )}
        >
          <span className="truncate text-right flex-1">
            {selectedOption ? (
              showCode && selectedOption.code ? (
                <span className="flex items-center gap-2 justify-end">
                  <span>{selectedOption.label}</span>
                  <span className="bg-gold/10 text-gold px-2 py-0.5 rounded-md text-sm font-bold">
                    {selectedOption.code}
                  </span>
                </span>
              ) : (
                selectedOption.label
              )
            ) : (
              placeholder
            )}
          </span>
          <ChevronsUpDown className="mr-2 h-5 w-5 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0 bg-background border-2 border-border shadow-xl rounded-xl z-50"
        align="start"
        sideOffset={8}
      >
        <Command className="rounded-xl" shouldFilter={false}>
          <div className="flex items-center border-b border-border px-3 py-2 bg-muted/30">
            <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex h-12 w-full bg-transparent py-3 text-base md:text-lg outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0"
            />
          </div>
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty className="py-8 text-center text-muted-foreground">
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "flex items-center justify-between gap-2 py-3 px-4 cursor-pointer",
                    "text-base md:text-lg min-h-[48px]",
                    "hover:bg-gold/10 active:bg-gold/20",
                    "transition-colors duration-150",
                    value === option.value && "bg-gold/10"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {showCode && option.code && (
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-sm font-bold min-w-[32px] text-center">
                        {option.code}
                      </span>
                    )}
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <Check
                    className={cn(
                      "h-5 w-5 text-gold shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
