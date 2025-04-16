// import * as React from 'react'
// import { ChevronLeft, ChevronRight } from 'lucide-react'
// import DatePicker from "react-datepicker";
// import { cn } from '@/lib/utils'
// import { buttonVariants } from '@/components/ui/button'
// import 'react-datepicker/dist/react-datepicker.css'
// export type CalendarProps = React.ComponentProps<typeof DayPicker>

// function Calendar({
//   className,
//   classNames,
//   showOutsideDays = true,
//   ...props
// }: CalendarProps) {
//   return (
//     <DatePicker
//       showOutsideDays={showOutsideDays}
//       className={cn('p-3', className)}
//       classNames={{
//         months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
//         month: 'space-y-4',
//         caption: 'flex justify-center pt-1 relative items-center',
//         caption_label: 'text-sm font-medium',
//         nav: 'space-x-1 flex items-center',
//         nav_button: cn(
//           buttonVariants({ variant: 'outline' }),
//           'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
//         ),
//         nav_button_previous: 'absolute left-1',
//         nav_button_next: 'absolute right-1',
//         table: 'w-full border-collapse space-y-1',
//         head_row: 'flex',
//         head_cell:
//           'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
//         row: 'flex w-full mt-2',
//         cell: cn(
//           'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
//           props.mode === 'range'
//             ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
//             : '[&:has([aria-selected])]:rounded-md'
//         ),
//         day: cn(
//           buttonVariants({ variant: 'ghost' }),
//           'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
//         ),
//         day_range_start: 'day-range-start',
//         day_range_end: 'day-range-end',
//         day_selected:
//           'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
//         day_today: 'bg-accent text-accent-foreground',
//         day_outside:
//           'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
//         day_disabled: 'text-muted-foreground opacity-50',
//         day_range_middle:
//           'aria-selected:bg-accent aria-selected:text-accent-foreground',
//         day_hidden: 'invisible',
//         ...classNames,
//       }}
//       components={{
//         IconLeft: () => <ChevronLeft className='h-4 w-4' />,
//         IconRight: () => <ChevronRight className='h-4 w-4' />,
//       }}
//       {...props}
//     />
//   )
// }
// Calendar.displayName = 'Calendar'

// export { Calendar }


import * as React from 'react'
import DatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import 'react-datepicker/dist/react-datepicker.css'

export type CalendarProps = {
  className?: string
  selected?: Date | [Date | null, Date | null] | null
  onChange?: (date: Date | [Date | null, Date | null] | null) => void
  selectsRange?: boolean
  [key: string]: any // allows additional props
}

function Calendar({
  className,
  selected,
  onChange,
  ...props
}: CalendarProps) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      className={cn('p-3', className)}
      wrapperClassName="datepicker-wrapper"
      renderCustomHeader={({
        date,
        decreaseMonth,
        increaseMonth,
      }: ReactDatePickerCustomHeaderProps) => (
        <div className="flex justify-between items-center w-full px-2 pb-2">
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
            )}
            onClick={decreaseMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium">
            {date.toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
            )}
            onClick={increaseMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }


export { Calendar }
