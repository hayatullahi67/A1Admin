import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function ApprovedInstructors() {
  // Mock data for approved instructors
  const approvedInstructors = [
    {
      id: 'INS-001',
      name: 'John Smith',
      avatar: '/placeholder.svg?height=40&width=40',
      expertise: 'Web Development',
      courses: 12,
      students: 2450,
    },
    {
      id: 'INS-002',
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg?height=40&width=40',
      expertise: 'Data Science',
      courses: 8,
      students: 1870,
    },
    {
      id: 'INS-007',
      name: 'Robert Taylor',
      avatar: '/placeholder.svg?height=40&width=40',
      expertise: 'Cybersecurity',
      courses: 6,
      students: 1240,
    },
  ]

  return (
    <div className='space-y-4'>
      {approvedInstructors.map((instructor) => (
        <div key={instructor.id} className='flex items-center'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={instructor.avatar} alt={instructor.name} />
            <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {instructor.name}
            </p>
            <p className='text-sm text-muted-foreground'>
              {instructor.expertise}
            </p>
          </div>
          <div className='ml-auto text-right text-sm'>
            <p className='font-medium'>{instructor.courses} courses</p>
            <p className='text-muted-foreground'>
              {instructor.students} students
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
