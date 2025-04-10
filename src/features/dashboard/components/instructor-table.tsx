'use client'

import { useState } from 'react'
import {
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Search,
  Check,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Define instructor type
interface Instructor {
  id: string
  name: string
  email: string
  expertise: string
  courses: number
  rating: number
  status: 'approved' | 'pending' | 'rejected'
  joinDate: string
}

// Mock data for instructors
const initialInstructors: Instructor[] = [
  {
    id: 'INS-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    expertise: 'Web Development',
    courses: 12,
    rating: 4.8,
    status: 'approved',
    joinDate: '2023-01-15',
  },
  {
    id: 'INS-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    expertise: 'Data Science',
    courses: 8,
    rating: 4.7,
    status: 'approved',
    joinDate: '2023-02-20',
  },
  {
    id: 'INS-003',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    expertise: 'Mobile Development',
    courses: 5,
    rating: 4.5,
    status: 'pending',
    joinDate: '2023-03-10',
  },
  {
    id: 'INS-004',
    name: 'Emily Rodriguez',
    email: 'e.rodriguez@example.com',
    expertise: 'UI/UX Design',
    courses: 7,
    rating: 4.9,
    status: 'pending',
    joinDate: '2023-03-15',
  },
  {
    id: 'INS-005',
    name: 'David Kim',
    email: 'd.kim@example.com',
    expertise: 'Machine Learning',
    courses: 3,
    rating: 4.6,
    status: 'rejected',
    joinDate: '2023-04-05',
  },
  {
    id: 'INS-006',
    name: 'Lisa Wang',
    email: 'l.wang@example.com',
    expertise: 'Blockchain',
    courses: 2,
    rating: 4.3,
    status: 'pending',
    joinDate: '2023-04-12',
  },
  {
    id: 'INS-007',
    name: 'Robert Taylor',
    email: 'r.taylor@example.com',
    expertise: 'Cybersecurity',
    courses: 6,
    rating: 4.7,
    status: 'approved',
    joinDate: '2023-02-28',
  },
  {
    id: 'INS-008',
    name: 'Jennifer Lee',
    email: 'j.lee@example.com',
    expertise: 'Digital Marketing',
    courses: 4,
    rating: 4.4,
    status: 'pending',
    joinDate: '2023-04-18',
  },
]

export function InstructorTable() {
  const [instructors, setInstructors] =
    useState<Instructor[]>(initialInstructors)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | ''>('')

  // Filter instructors based on search term and status
  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.expertise.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || instructor.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle status change
  const handleStatusChange = (
    instructorId: string,
    newStatus: 'approved' | 'rejected'
  ) => {
    setInstructors(
      instructors.map((instructor) =>
        instructor.id === instructorId
          ? { ...instructor, status: newStatus }
          : instructor
      )
    )
    setIsDialogOpen(false)
  }

  // Open confirmation dialog
  const openConfirmDialog = (
    instructor: Instructor,
    action: 'approve' | 'reject'
  ) => {
    setSelectedInstructor(instructor)
    setActionType(action)
    setIsDialogOpen(true)
  }

  // Get status badge color
  const getStatusBadge = (status: 'approved' | 'pending' | 'rejected') => {
    switch (status) {
      case 'approved':
        return (
          <Badge className='bg-green-500 hover:bg-green-600'>Approved</Badge>
        )
      case 'pending':
        return (
          <Badge className='bg-yellow-500 hover:bg-yellow-600'>Pending</Badge>
        )
      case 'rejected':
        return <Badge className='bg-red-500 hover:bg-red-600'>Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <div className='relative w-full sm:w-64'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Search instructors...'
            className='w-full pl-8'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-full sm:w-40'>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Statuses</SelectItem>
            <SelectItem value='approved'>Approved</SelectItem>
            <SelectItem value='pending'>Pending</SelectItem>
            <SelectItem value='rejected'>Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className='hidden md:table-cell'>Expertise</TableHead>
              <TableHead className='hidden md:table-cell'>Courses</TableHead>
              <TableHead className='hidden md:table-cell'>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInstructors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='py-8 text-center text-muted-foreground'
                >
                  No instructors found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredInstructors.map((instructor) => (
                <TableRow key={instructor.id}>
                  <TableCell>
                    <div className='font-medium'>{instructor.name}</div>
                    <div className='text-sm text-muted-foreground'>
                      {instructor.email}
                    </div>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {instructor.expertise}
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {instructor.courses}
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {instructor.rating}
                  </TableCell>
                  <TableCell>{getStatusBadge(instructor.status)}</TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            openConfirmDialog(instructor, 'approve')
                          }
                          disabled={instructor.status === 'approved'}
                        >
                          <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            openConfirmDialog(instructor, 'reject')
                          }
                          disabled={instructor.status === 'rejected'}
                        >
                          <XCircle className='mr-2 h-4 w-4 text-red-500' />
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Approval/Rejection Confirmation Dialog */}
      {selectedInstructor && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'approve'
                  ? 'Approve Instructor'
                  : 'Reject Instructor'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'approve'
                  ? 'Are you sure you want to approve this instructor? They will be able to create and publish courses.'
                  : 'Are you sure you want to reject this instructor? They will not be able to create courses.'}
              </DialogDescription>
            </DialogHeader>
            <div className='py-4'>
              <div className='flex items-center gap-4 rounded-lg border p-4'>
                <div>
                  <div className='font-medium'>{selectedInstructor.name}</div>
                  <div className='text-sm text-muted-foreground'>
                    {selectedInstructor.email}
                  </div>
                  <div className='mt-1 text-sm'>
                    {selectedInstructor.expertise}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'approve' ? 'default' : 'destructive'}
                onClick={() =>
                  handleStatusChange(
                    selectedInstructor.id,
                    actionType === 'approve' ? 'approved' : 'rejected'
                  )
                }
              >
                {actionType === 'approve' ? (
                  <>
                    <Check className='mr-2 h-4 w-4' /> Approve
                  </>
                ) : (
                  <>
                    <X className='mr-2 h-4 w-4' /> Reject
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
