'use client'

import { useState } from 'react'
import { Search, MoreHorizontal, Ban, User } from 'lucide-react'
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

// Define student type
interface Student {
  id: string
  name: string
  email: string
  joinDate: string
  coursesPurchased: number
  totalSpent: number
  status: 'active' | 'banned'
  lastActive: string
}

// Mock data for students
const initialStudents: Student[] = [
  {
    id: 'STU-001',
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    joinDate: '2023-01-10',
    coursesPurchased: 8,
    totalSpent: 349.99,
    status: 'active',
    lastActive: '2023-05-15',
  },
  {
    id: 'STU-002',
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    joinDate: '2023-02-05',
    coursesPurchased: 12,
    totalSpent: 599.99,
    status: 'active',
    lastActive: '2023-05-18',
  },
  {
    id: 'STU-003',
    name: 'James Wilson',
    email: 'james.w@example.com',
    joinDate: '2023-02-15',
    coursesPurchased: 3,
    totalSpent: 129.99,
    status: 'active',
    lastActive: '2023-05-10',
  },
  {
    id: 'STU-004',
    name: 'Emma Brown',
    email: 'emma.b@example.com',
    joinDate: '2023-03-01',
    coursesPurchased: 5,
    totalSpent: 249.99,
    status: 'banned',
    lastActive: '2023-04-20',
  },
  {
    id: 'STU-005',
    name: 'David Lee',
    email: 'david.l@example.com',
    joinDate: '2023-03-10',
    coursesPurchased: 7,
    totalSpent: 329.99,
    status: 'active',
    lastActive: '2023-05-17',
  },
  {
    id: 'STU-006',
    name: 'Sophia Martinez',
    email: 'sophia.m@example.com',
    joinDate: '2023-03-22',
    coursesPurchased: 10,
    totalSpent: 499.99,
    status: 'active',
    lastActive: '2023-05-19',
  },
  {
    id: 'STU-007',
    name: 'Daniel Taylor',
    email: 'daniel.t@example.com',
    joinDate: '2023-04-05',
    coursesPurchased: 2,
    totalSpent: 99.99,
    status: 'active',
    lastActive: '2023-05-12',
  },
  {
    id: 'STU-008',
    name: 'Olivia Anderson',
    email: 'olivia.a@example.com',
    joinDate: '2023-04-15',
    coursesPurchased: 4,
    totalSpent: 199.99,
    status: 'banned',
    lastActive: '2023-05-01',
  },
]

export function StudentTable() {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter students based on search term and status
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || student.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle status change (ban/unban)
  const handleStatusChange = (
    studentId: string,
    newStatus: 'active' | 'banned'
  ) => {
    setStudents(
      students.map((student) =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    )
    setIsDialogOpen(false)
  }

  // Open confirmation dialog
  const openConfirmDialog = (student: Student) => {
    setSelectedStudent(student)
    setIsDialogOpen(true)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Get status badge
  const getStatusBadge = (status: 'active' | 'banned') => {
    switch (status) {
      case 'active':
        return <Badge className='bg-green-500 hover:bg-green-600'>Active</Badge>
      case 'banned':
        return <Badge className='bg-red-500 hover:bg-red-600'>Banned</Badge>
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
            placeholder='Search students...'
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
            <SelectItem value='all'>All Students</SelectItem>
            <SelectItem value='active'>Active</SelectItem>
            <SelectItem value='banned'>Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead className='hidden md:table-cell'>Joined</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='py-8 text-center text-muted-foreground'
                >
                  No students found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className='font-medium'>{student.name}</div>
                    <div className='text-sm text-muted-foreground'>
                      {student.email}
                    </div>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {new Date(student.joinDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{student.coursesPurchased}</TableCell>
                  <TableCell>{formatCurrency(student.totalSpent)}</TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
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
                        {student.status === 'active' ? (
                          <DropdownMenuItem
                            onClick={() => openConfirmDialog(student)}
                          >
                            <Ban className='mr-2 h-4 w-4 text-red-500' />
                            Ban Student
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(student.id, 'active')
                            }
                          >
                            <User className='mr-2 h-4 w-4 text-green-500' />
                            Unban Student
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>View Purchases</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Ban Confirmation Dialog */}
      {selectedStudent && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ban Student</DialogTitle>
              <DialogDescription>
                Are you sure you want to ban this student? They will no longer
                be able to access the platform or purchase courses.
              </DialogDescription>
            </DialogHeader>
            <div className='py-4'>
              <div className='flex items-center gap-4 rounded-lg border p-4'>
                <div>
                  <div className='font-medium'>{selectedStudent.name}</div>
                  <div className='text-sm text-muted-foreground'>
                    {selectedStudent.email}
                  </div>
                  <div className='mt-1 text-sm'>
                    Purchased {selectedStudent.coursesPurchased} courses • Spent{' '}
                    {formatCurrency(selectedStudent.totalSpent)}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={() => handleStatusChange(selectedStudent.id, 'banned')}
              >
                <Ban className='mr-2 h-4 w-4' /> Ban Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
