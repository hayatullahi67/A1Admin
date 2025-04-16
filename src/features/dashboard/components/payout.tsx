'use client'

import { useState , useEffect} from 'react'
import { Search, MoreHorizontal, Ban, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
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
interface Request {
  id: string
  requester_id:string
  amount: number
  approved: boolean
  transferred: boolean
  status: string
}

// Mock data for students
// type ResponseData = {
//   data: Request[];
// };

export function Payout() {
  const [requests, setRequests] = useState<Request[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  // const [selectedStudent, setSelectedStudent] = useState<Request | null>(null)
  // const [isDialogOpen, setIsDialogOpen] = useState(false)
  //  const [courses , setCourses] = useState([])
   const [payoutIds, setPayoutIds] = useState<string[]>([]);

   const userData = JSON.parse(localStorage.getItem("user") || "{}");
   const token = userData.token;
useEffect(() => {
  const fetchData = async () => {
    
   
    try {
      const result = await fetch('https://api.a1schools.org/admin/payout-requests', {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!result.ok) {
        throw new Error('Failed to fetch setRequest');
      }

      const data = await result.json();
      console.log("Fetched data:", data); // Check the structure of the response

      if (Array.isArray(data.data) && data.data.length > 0) {
        setRequests(data.data);
        setPayoutIds(data.data.map((request: Request) => request.id));

         const pid = payoutIds;
         console.log(pid)
      } else {
        setRequests([]); // Handle empty array or non-array data
      }



     

      

    } catch (error) {
      console.error("Error fetching data:", error);
      
    }




        
      
  
  
  
       
  
        
  
      
  };

  fetchData();
}, []);




const updatePayoutStatus = async (payoutId: string,  action: "approved" | "rejected") => {
 
  try {
    const response = await fetch(`https://api.a1schools.org/admin/payout-requests/${payoutId}`, {
      method: 'PUT', // or 'PUT' depending on what the API expects
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: action }), // Send the approval state
    });

    if (!response.ok) {
      throw new Error('Failed to update payout status');
    }

    // Update state locally after successful request
    // setRequests((prevRequests) =>
    //   prevRequests.map((r) =>
    //     r.id === payoutId ? { ...r, action } : r
    //   )
    // );

    setRequests((prevRequests) =>
      prevRequests.map((r) =>
        r.id === payoutId ? { ...r, status: action } : r
      )
    );
    const data = await response.json();
    console.log(`${action} successful`, data);
    console.log(`Payout ${payoutId} updated successfully`);
  } catch (error) {
    console.error('Error updating payout:', error);
    console.error(`${action} failed`, error);
  }
};
 
 
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
    // request?.amount?.toLowerCase().includes(searchTerm.toLowerCase())

    request?.amount?.toString()?.toLowerCase().includes(searchTerm.toLowerCase())

      
    const matchesStatus =
  statusFilter === 'all' || request.approved === (statusFilter === 'true');

    return matchesSearch && matchesStatus
  })

  // Handle status change (ban/unban)
  // const handleStatusChange = (
  //   studentId: string,
  //   newStatus: 'Approved' | 'Not Approved'
  // ) => {
  //   setRequests(
  //     requests.map((request) =>
  //       request.id === studentId ? { ...request, status: newStatus } : request
  //     )
  //   )
  //   setIsDialogOpen(false)
  // }

  // Open confirmation dialog
  // const openConfirmDialog = (request: Request) => {
  //   setSelectedStudent(request)
  //   setIsDialogOpen(true)
  // }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
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
            <SelectItem value='all'>All Requests</SelectItem>
            <SelectItem value='active'>Approved</SelectItem>
            <SelectItem value='banned'>Not Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Transferred</TableHead>
              <TableHead>Requester ID</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='py-8 text-center text-muted-foreground'
                >
                  No students found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                
                  
                  <TableCell>{formatCurrency(request.amount)}</TableCell>
                  <TableCell> 
                    {request.approved ? (
    <Badge className='bg-green-500 hover:bg-green-600'>Approved</Badge>
  ) : (
    <Badge className='bg-red-500 hover:bg-red-600'>Not Approved</Badge>
  )}
   {/* {request.status === 'approved' ? (
    <Badge className='bg-green-500 hover:bg-green-600'>Approved</Badge>
  ) : request.status === 'rejected' ? (
    <Badge className='bg-red-500 hover:bg-red-600'>Rejected</Badge>
  ) : (
    <Badge className='bg-yellow-500 hover:bg-yellow-600'>Pending</Badge>
  )} */}
  </TableCell>

<TableCell> {request.transferred ? (
    <Badge className='bg-green-500 hover:bg-green-600'>Yes</Badge>
  ) : (
    <Badge className='bg-red-500 hover:bg-red-600'>No</Badge>
  )}</TableCell>

<TableCell>{request.requester_id}</TableCell>

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
                        {/* {request.approved ? (
                           <span className="text-green-600 font-semibold">Approved</span>
                        ) 
                        :
                        (
                          
                          <>
                             <DropdownMenuItem
                            onClick={() => updatePayoutStatus(request.id, "approved")}
                          >
                            <User className='mr-2 h-4 w-4 text-green-500' />
                            Approve Request
                          </DropdownMenuItem>
                       
                          <DropdownMenuItem
                            onClick={() => updatePayoutStatus(request.id, "rejected")}
                          >
                            <Ban className='mr-2 h-4 w-4 text-red-500' />

                            Reject Request
                          </DropdownMenuItem>
                          </>
                        )} */}

                         
{request.approved ? (
  <span className="text-green-600 font-semibold">Approved</span>
) : request.status === "rejected" ? (
  <span className="text-red-600 font-semibold">Rejected</span>
) : (
  <>
    <DropdownMenuItem
      onClick={() => updatePayoutStatus(request.id, "approved")}
    >
      <User className='mr-2 h-4 w-4 text-green-500' />
      Approve Request
    </DropdownMenuItem>

    <DropdownMenuItem
      onClick={() => updatePayoutStatus(request.id, "rejected")}
    >
      <Ban className='mr-2 h-4 w-4 text-red-500' />
      Reject Request
    </DropdownMenuItem>
  </>
)}

                        <DropdownMenuSeparator />
                       
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
     
    </div>
  )
}
