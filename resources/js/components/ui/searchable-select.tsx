import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface SearchableSelectOption {
    value: string
    label: string
}

interface SearchableSelectProps {
    options: SearchableSelectOption[]
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    className?: string
    id?: string
    disabled?: boolean
    searchPlaceholder?: string
}

export function SearchableSelect({
    options,
    value,
    onValueChange,
    placeholder = "Pilih...",
    className,
    id,
    disabled,
    searchPlaceholder = "Cari...",
}: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    const selectedOption = options.find((option) => option.value === value)

    const filteredOptions = React.useMemo(() => {
        if (!search) return options
        const searchLower = search.toLowerCase()
        return options.filter(
            (option) =>
                option.label.toLowerCase().includes(searchLower) ||
                option.value.toLowerCase().includes(searchLower)
        )
    }, [options, search])

    const handleSelect = (optionValue: string) => {
        onValueChange?.(optionValue)
        setOpen(false)
        setSearch("")
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            setSearch("")
        }
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between font-normal",
                        !selectedOption && "text-muted-foreground",
                        className
                    )}
                    disabled={disabled}
                    id={id}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <div className="p-2">
                    <Input
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-9"
                        autoFocus
                    />
                </div>
                <div className="max-h-[300px] overflow-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={cn(
                                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                    value === option.value && "bg-accent"
                                )}
                                onClick={() => handleSelect(option.value)}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </button>
                        ))
                    ) : (
                        <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                            Tidak ada hasil ditemukan
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

