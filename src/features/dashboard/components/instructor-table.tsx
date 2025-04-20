'use client'

import { useState , useEffect} from 'react'
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
  fullname: string
  email: string
  verified: boolean;
  status: 'approved' | 'pending' | 'rejected'
}

interface Course {
  id: string;
  name: string;
  amount: number;
  rating: number;
  instructorEmail: string;
  average_rating?: number;
}

interface InstructorRequest {
  id: string,
  user_id: string,
  status: string,
  approved: boolean
}


export function InstructorTable() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [courses, setCourses] = useState<{ [key: string]: Course[] }>({});
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | ''>('')
  const [requests, setRequests] = useState<InstructorRequest[]>([]);
  
  
 

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const token = userData.token;

useEffect(() => {
  const fetchData = async () => {
   
    try {
      const result = await fetch('https://api.a1schools.org/instructors', {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!result.ok) {
        throw new Error('Failed to fetch instructors');
      }

      const data = await result.json();
      console.log("Fetched data:", data); // Check the structure of the response

      if (Array.isArray(data.data) && data.data.length > 0) {
        setInstructors(data.data);
                    
      } else {
        setInstructors([]); // Handle empty array or non-array data
      }

     

     

    


      const coursesData: { [key: string]: Course[] } = {};

      for (let instructor of data.data) {
        const instructorId = instructor.id;
        const coursesResult = await fetch(
          `https://api.a1schools.org/instructors/${instructorId}/courses`,
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
          coursesData[instructorId] = coursesList.data || [];
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

//  const getStatusBadge = (verified: boolean) => {
//     return verified ? (
//       <Badge className='bg-green-500 hover:bg-green-600'>Approved</Badge>
//     ) : (
//       <Badge className='bg-yellow-500 hover:bg-yellow-600'>Pending</Badge>
//     );
//   };
 
  

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('https://api.a1schools.org/admin/instructor-requests', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch instructor requests');
        const data = await res.json();
        console.log('Instructor Requests:', data);

        if (Array.isArray(data.data)) {
          // Extract only id, user_id, and status
          const simplifiedRequests = data.data.map((request:any) => ({
            id: request.id,
            user_id: request.user_id,
            status: request.status,
          }));
           console.log("simply",simplifiedRequests)
          setRequests(simplifiedRequests);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        // setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className='bg-green-500 hover:bg-green-600'>Approved</Badge>;
      case 'rejected':
        return <Badge className='bg-red-500 hover:bg-red-600'>Rejected</Badge>;
      default:
        return <Badge className='bg-yellow-500 hover:bg-yellow-600'>Pending</Badge>;
    }
  };
  

  const getInstructorStatus = (instructorId: string) => {
    const request = requests.find((req) => req.user_id === instructorId);
    return request?.status || 'pending';
  };
 
  const getInstructorRequest = (instructorId: string) => {
    return requests.find((req) => req.user_id === instructorId);
  };

//   const getInstructorRequestId = (instructorId) => {
//     const request = getInstructorRequest(instructorId);
//     if (request) {
//       return request.id;  // Assuming the request has an 'id' field
//     } else {
//       console.error('Request not found');
//       return null;  // Return null if the request is not found
//     }
//   };

//   // const instructors = instructors;


//   // Create an array to store the requestIds outside of the loop
// const requestIds: string[] = [];

// instructors.forEach(instructor => {
//   // Push each requestId to the array
//   requestIds.push(getInstructorRequestId(instructor.id));
// });

// // Now, requestIds is accessible outside the loop
// console.log(requestIds); // You can use requestIds here


// Assuming getInstructorRequest returns a valid object or null
const getInstructorRequestId = (instructorId: string): string | null => {
  const request = getInstructorRequest(instructorId);
  if (request) {
    return request.id;  // Assuming the request has an 'id' field
  } else {
    console.error('Request not found');
    return null;  // Return null if the request is not found
  }
};

// Assuming instructors is an array of objects with 'id' properties
const requestIds: string[] = [];

// Iterating over the instructors array
instructors.forEach(instructor => {
  const requestId = getInstructorRequestId(instructor.id);
  if (requestId) {
    requestIds.push(requestId);  // Only push if requestId is not null
  }
});

// Now, requestIds is accessible outside the loop
console.log("requestid",requestIds);


  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase());
  
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'approved' && instructor.verified) ||
      (statusFilter === 'pending' && !instructor.verified);
  
    return matchesSearch && matchesStatus;
  });
 
  
  
  // const handleStatusChange = (
  //   instructorId: string,
  //   newStatus: 'approved' | 'rejected'
  // ) => {
  //   setInstructors(
  //     instructors.map((instructor) =>
  //       instructor.id === instructorId
  //         ? { ...instructor, status: newStatus }
  //         : instructor
  //     )
  //   )
  //   // setIsDialogOpen(false)
  // }

  // Open confirmation dialog
  const handleInstructorAction = async (id:string, action:any) => {
    try {
      const response = await fetch(`https://api.a1schools.org/admin/instructor-requests/${id}`, {
        method: 'PUT', // Or POST if API requires that
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: action === 'approve' ? 'approved' : 'rejected'
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update instructor status');
      }
  
      const data = await response.json();
      console.log('Instructor updated:', data);
      // alert(`Instructor ${action}d successfully`);
      setRequests(prev =>
        prev.map(req =>
          req.id === id ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req
        )
      );
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };
  

 
 
  const openConfirmDialog = (
    instructor: Instructor,
    action: 'approve' | 'reject'
  ) => {
    setSelectedInstructor(instructor)
    setActionType(action)
    setIsDialogOpen(true)
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
            {/* <SelectItem value='pending'>Pending</SelectItem>
            <SelectItem value='rejected'>Rejected</SelectItem> */}
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
            {filteredInstructors.length > 0 ?  (
              filteredInstructors.map((instructor) => 
                { 
                  const instructorCourses = courses[instructor.id] || [];
                  const remainingCourses = instructorCourses.slice(1);
                  // const request = getInstructorRequest(instructor.id); // ✅ Get the matched request
                  // const requestId = request?.id || null
                  return(
                    <>
                <TableRow key={instructor.id}>
                  
                  <TableCell>
                    <div className='font-medium'>{instructor.fullname}</div>
                    <div className='text-sm text-muted-foreground'>
                      {instructor.email}
                    </div>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                  {courses[instructor.id]?.[0]?.name || "No course"}
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                  {courses[instructor.id]?.length || 0}

                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                  {courses[instructor.id]?.[0]?.average_rating ||  0}

                  </TableCell>
                  <TableCell>{getStatusBadge(getInstructorStatus(instructor.id))}</TableCell>
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
                        {/* {getInstructorStatus(instructor.id) === "pending" ? 
                        (
                        <>
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
                        </>) : 
                        getInstructorStatus(instructor.id) === "rejected" ? (
                          <>Rejected</>
                        ): getInstructorStatus(instructor.id) === "approved" ? (
                          <>
                          Approved
                          </>
                        )} */}

{getInstructorStatus(instructor.id) === "pending" ? (
  <>
    <DropdownMenuItem
      onClick={() => openConfirmDialog(instructor, 'approve')}
      disabled={instructor.status === 'approved'}
    >
      <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
      Approve
    </DropdownMenuItem>
    <DropdownMenuItem
      onClick={() => openConfirmDialog(instructor, 'reject')}
      disabled={instructor.status === 'rejected'}
    >
      <XCircle className='mr-2 h-4 w-4 text-red-500' />
      Reject
    </DropdownMenuItem>
  </>
) : getInstructorStatus(instructor.id) === "rejected" ? (
  <DropdownMenuItem disabled>
    Rejected
  </DropdownMenuItem>
) : getInstructorStatus(instructor.id) === "approved" ? (
  <DropdownMenuItem disabled>
    Approved
  </DropdownMenuItem>
) : null}

                       
                        <DropdownMenuSeparator />
                       {/* <DropdownMenuItem>View Profile</DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  

                 
                </TableRow>
                {remainingCourses.length > 0 && (
        <>
         
              {remainingCourses.map((course) => (
                <TableRow>
                  
                <TableCell>
                  <div className='font-medium'></div>
                  <div className='text-sm text-muted-foreground'>
                    
                  </div>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                {course.name}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                

                </TableCell>
                <TableCell className='hidden md:table-cell'>
                {course.average_rating ||  0}

                </TableCell>
                <TableCell></TableCell>
                <TableCell className='text-right'>
                 
                </TableCell>
                
               </TableRow>
               
              
              ))}
            
          
        </>
      )}
                </>
              )})
            ) : (
              <>
              <TableRow>
                
                <TableCell
                  colSpan={6}
                  className='py-8 text-center text-muted-foreground'
                >
                  No instructors found matching your criteria
                </TableCell>
              </TableRow>
      </>
              )
          }
          </TableBody>





        </Table>
      </div>

      {/* Approval/Rejection Confirmation Dialog */}
      {/* {selectedInstructor && (
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
                  <div className='font-medium'>{selectedInstructor.fullname}</div>
                  <div className='text-sm text-muted-foreground'>
                    {selectedInstructor.email}
                  </div>
                  <div className='mt-1 text-sm'>
                    
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
      )} */}


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
            <div className='font-medium'>{selectedInstructor.fullname}</div>
            <div className='text-sm text-muted-foreground'>
              {selectedInstructor.email}
            </div>
            <div className='mt-1 text-sm'>
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
          onClick={() => {
            handleInstructorAction(getInstructorRequestId(selectedInstructor?.id || '') as string, actionType);
            setIsDialogOpen(false);
          }}
          
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
