import * as React from "react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    className?: string
    id?: string
    required?: boolean
    disabled?: boolean
}

export function DatePicker({
    value,
    onChange,
    placeholder = "Pilih tanggal",
    className,
    id,
    required,
    disabled,
}: DatePickerProps) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
        value ? new Date(value) : undefined
    )

    React.useEffect(() => {
        if (value) {
            setSelectedDate(new Date(value))
        } else {
            setSelectedDate(undefined)
        }
    }, [value])

    const handleSelect = (date: Date | undefined) => {
        setSelectedDate(date)
        if (date && onChange) {
            // Format date as YYYY-MM-DD for input compatibility
            const formattedDate = format(date, "yyyy-MM-dd")
            onChange(formattedDate)
        } else if (!date && onChange) {
            onChange("")
        }
    }

    const displayValue = selectedDate
        ? format(selectedDate, "dd MMMM yyyy", { locale: idLocale })
        : ""

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                        className
                    )}
                    disabled={disabled}
                    id={id}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {displayValue || <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

