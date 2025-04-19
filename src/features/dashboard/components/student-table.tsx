'use client'

import { useState , useEffect} from 'react'
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
  fullname: string
  email: string
  created_at: string
  coursesPurchased: number
  totalSpent: number
  verified: boolean
  lastActive: string
}

// Mock data for students
interface Course {
  id: string;
  name: string;
  amount: number;
  rating: number;
  instructorEmail: string;
  average_rating?: number;
}

type Courses = { [key: string]: Course[] };
export function StudentTable() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
   const [courses , setCourses] = useState<Courses>({});

   const userData = JSON.parse(localStorage.getItem("user") || "{}");
   const token = userData.token;

useEffect(() => {
  const fetchData = async () => {
    
    try {
      const result = await fetch('https://api.a1schools.org/users?roles=student', {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!result.ok) {
        throw new Error('Failed to fetch setStudents');
      }

      const data = await result.json();
      console.log("Fetched data:", data); // Check the structure of the response

      if (Array.isArray(data.data) && data.data.length > 0) {
        setStudents(data.data);
                    
      } else {
        setStudents([]); // Handle empty array or non-array data
      }



      const coursesData: { [key: string]: Course[] } = {};

      for (let student of data.data) {
        const studentId = student.id;
        const coursesResult = await fetch(
          `https://api.a1schools.org/users/${studentId}/courses`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (coursesResult.ok) {
          const coursesList = await coursesResult.json();
          coursesData[studentId] = coursesList.data || [];
          console.log("hello",coursesData)
        }
      }

      setCourses(coursesData);
     

      

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, []);




 
 
const filteredStudents = students.filter((student) => {
  const matchesSearch =
    student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === 'all' ||
    (statusFilter === 'approved' && student.verified) ||
    (statusFilter === 'pending' && !student.verified);

  return matchesSearch && matchesStatus;
});

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
  // const openConfirmDialog = (student: Student) => {
  //   setSelectedStudent(student)
  //   setIsDialogOpen(true)
  // }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Get status badge
  const getStatusBadge = (verified: boolean) => {
    return verified ? (
      <Badge className='bg-green-500 hover:bg-green-600'>Active</Badge>
    ) : (
      <Badge className='bg-yellow-500 hover:bg-yellow-600'>Banned</Badge>
    );
  };

  
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
            {/* <SelectItem value='active'>Active</SelectItem>
            <SelectItem value='banned'>Banned</SelectItem> */}
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
              
              <TableHead>Status</TableHead>
              {/* <TableHead className='text-right'>Actions</TableHead> */}
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
                    <div className='font-medium'>{student.fullname}</div>
                    <div className='text-sm text-muted-foreground'>
                      {student.email}
                    </div>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {new Date(student.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{courses[student.id]?.length || 0}</TableCell>
                 
                  <TableCell> {getStatusBadge(student.verified)}</TableCell>
                  {/* <TableCell className='text-right'>
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
                        {student.verified === true ? (
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
                  </TableCell> */}
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
                  <div className='font-medium'>{selectedStudent.fullname}</div>
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
