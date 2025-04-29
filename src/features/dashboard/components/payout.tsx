





// 'use client'

// import { useState, useEffect } from 'react'
// import { Search, MoreHorizontal, Ban, User, Eye } from 'lucide-react'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { Input } from '@/components/ui/input'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'

// // Define student type
// interface Request {
//   id: string
//   requester_id: string
//   amount: number
//   approved: boolean
//   transferred: boolean
//   status: string
//   instructorName?: string
//   accountNumber?: string
//   accountBank?: string
// }

// interface Instructor {
//   id: string
//   fullname: string
//   email: string
//   verified: boolean
//   bank?: {
//     account_number: string
//   }
// }

// interface RequestDetail extends Request {
//   instructor?: Instructor
// }

// export function Payout() {
//   const [requests, setRequests] = useState<Request[]>([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statusFilter, setStatusFilter] = useState('all')
//   const [payoutIds, setPayoutIds] = useState<string[]>([])
//   const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null)
//   const [requestDetails, setRequestDetails] = useState<{[key: string]: RequestDetail}>({})
//   const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({})
//   const [banks, setBanks] = useState<{ code: string, name: string }[]>([]);

//   const userData = JSON.parse(localStorage.getItem("user") || "{}")
//   const token = userData.token

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await fetch('https://api.a1schools.org/admin/payout-requests', {
//           method: "GET",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })

//         if (!result.ok) {
//           throw new Error('Failed to fetch setRequest')
//         }

//         const data = await result.json()
//         console.log("Fetched data:", data)

//         if (Array.isArray(data.data) && data.data.length > 0) {
//           setRequests(data.data)
//           setPayoutIds(data.data.map((request: Request) => request.id))
          
//           // Fetch details for each request to get instructor name and account number
//           fetchAllInstructorDetails(data.data)
          
//           const pid = payoutIds
//           console.log("hi", pid)
//         } else {
//           setRequests([])
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error)
//       }
//     }

//     fetchData()
//   }, [])

//   // Fetch instructor details for all requests
//   const fetchAllInstructorDetails = async (requestsData: Request[]) => {
//     try {
//       const detailsPromises = requestsData.map(request => 
//         fetch(`https://api.a1schools.org/admin/payout-requests/${request.id}`, {
//           method: "GET",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }).then(res => {
//           if (!res.ok) throw new Error(`Failed to fetch details for ${request.id}`)
//           return res.json()
//         })
//       )
      
//       const detailsResults = await Promise.allSettled(detailsPromises)
      
//       const updatedRequests = [...requestsData]
      
//       detailsResults.forEach((result, index) => {
//         if (result.status === 'fulfilled' && result.value.data) {
//           const requestId = requestsData[index].id
          
//           // Store complete details in requestDetails state
//           setRequestDetails(prev => ({
//             ...prev,
//             [requestId]: result.value.data
//           }))
          
//           // Update requests with instructor name and account number
//           updatedRequests[index] = {
//             ...updatedRequests[index],
//             instructorName: result.value.data.instructor?.fullname || 'N/A',
//             accountNumber: result.value.data.instructor?.bank?.account_number || 'N/A',
//             accountBank: result.value.data.instructor?.bank?.account_bank || 'N/A'
//           }
//         }
//       })
      
//       setRequests(updatedRequests)
//     } catch (error) {
//       console.error("Error fetching instructor details:", error)
//     }
//   }

//   const fetchRequestDetails = async (requestId: string) => {
//     if (requestDetails[requestId]) {
//       // Toggle expanded state if details already loaded
//       setExpandedRequestId(expandedRequestId === requestId ? null : requestId)
//       return
//     }

//     setIsLoading(prev => ({ ...prev, [requestId]: true }))
    
//     try {
//       const response = await fetch(`https://api.a1schools.org/admin/payout-requests/${requestId}`, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error('Failed to fetch request details')
//       }

//       const data = await response.json()
//       console.log(`Details for ${requestId}:`, data)

//       // Update the request with instructor info
//       setRequests(prevRequests => 
//         prevRequests.map(req => 
//           req.id === requestId ? {
//             ...req,
//             instructorName: data.data.instructor?.fullname || 'N/A',
//             accountNumber: data.data.instructor?.bank?.account_number || 'N/A',
//             accountbank: data.data.instructor?.bank?.account_bank || 'N/A'
//           } : req
//         )
//       )

      
//       setRequestDetails(prev => ({
//         ...prev,
//         [requestId]: data.data
//       }))
      
//       setExpandedRequestId(requestId)
//     } catch (error) {
//       console.error("Error fetching request details:", error)
//     } finally {
//       setIsLoading(prev => ({ ...prev, [requestId]: false }))
//     }
//   }
  
  
//   const fetchBanks = async () => {
//     try {
//       const response = await fetch('https://api.a1schools.org/utility/get-banks', {
//         method: 'GET',
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to fetch banks');
//       }
  
//       const data = await response.json();
//       setBanks(data.data); // Store banks in state
//     } catch (error) {
//       console.error('Error fetching banks:', error);
//     }
//   };

//   useEffect(() => {
//     fetchBanks();
//   }, []);

//   const getBankName = (accountBank: string) => {
//   const bank = banks.find(b => b.code === accountBank);
//   return bank ? bank.name : 'Unknown Bank';
// };
//   // console.log("wwww",fetchRequestDetails)
//   const updatePayoutStatus = async (payoutId: string, action: "approved" | "rejected") => {
//     try {
//       const response = await fetch(`https://api.a1schools.org/admin/payout-requests/${payoutId}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: action }),
//       })

//       if (!response.ok) {
//         throw new Error('Failed to update payout status')
//       }

//       setRequests((prevRequests) =>
//         prevRequests.map((r) =>
//           r.id === payoutId ? { ...r, status: action } : r
//         )
//       )

//       if (requestDetails[payoutId]) {
//         setRequestDetails(prev => ({
//           ...prev,
//           [payoutId]: { ...prev[payoutId], status: action }
//         }))
//       }

//       const data = await response.json()
//       console.log(`${action} successful`, data)
//       console.log(`Payout ${payoutId} updated successfully`)
//     } catch (error) {
//       console.error('Error updating payout:', error)
//       console.error(`${action} failed`, error)
//     }
//   }
 
//   // const filteredRequests = requests.filter((request) => {
//   //   const matchesSearch = request?.amount?.toString()?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //                        (request?.instructorName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
//   //   const matchesStatus = statusFilter === 'all' || request.status === statusFilter

//   //   return matchesSearch && matchesStatus
//   // })

//   // Format currency
 
 
 
//   const filteredRequests = requests.filter((request) => {
//     const matchesSearch = 
//       request?.amount?.toString()?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (request?.instructorName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
//     let matchesStatus = false;
    
//     // Handle status filtering
//     if (statusFilter === 'all') {
//       matchesStatus = true;
//     } else if (statusFilter === 'approved') {
//       matchesStatus = request.status === 'approved' || request.approved === true;
//     } else if (statusFilter === 'rejected') {
//       matchesStatus = request.status === 'rejected';
//     } else if (statusFilter === 'pending') {
//       // Pending means not approved and not rejected
//       matchesStatus = !request.approved && request.status !== 'rejected';
//     } else if (statusFilter === 'transferred') {
//       matchesStatus = request.transferred === true;
//     } else if (statusFilter === 'not-transferred') {
//       matchesStatus = request.transferred === false;
//     }

//     return matchesSearch && matchesStatus;
//   })
 
 
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(amount)
//   }

//   return (
//     <div className='space-y-4'>
//       <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
//         <div className='relative w-full sm:w-64'>
//           <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
//           <Input
//             type='search'
//             placeholder='Search amounts or instructors...'
//             className='w-full pl-8'
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className='w-full sm:w-40'>
//             <SelectValue placeholder='Filter by status' />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value='all'>All Requests</SelectItem>
//             <SelectItem value='approved'>Approved</SelectItem>
//             <SelectItem value='rejected'>Rejected</SelectItem>
//             <SelectItem value='pending'>Pending</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className='rounded-md border'>
//         <Table>
//           <TableHeader>
//             <TableRow>
//             <TableHead>Instructor Name</TableHead>
//             <TableHead>Account Number</TableHead>
//               <TableHead>Bank Name</TableHead>
//               <TableHead>Amount</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Transferred</TableHead>           
//               <TableHead>Requester ID</TableHead>
//               <TableHead className='text-right'>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredRequests.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={7}
//                   className='py-8 text-center text-muted-foreground'
//                 >
//                   No requests found matching your criteria
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredRequests.map((request) => (
//                 <TableRow key={request.id}>
//                    <TableCell>{request.instructorName || 'Loading...'}</TableCell>
//                    <TableCell>{request.accountNumber || 'Loading...'}</TableCell>
//                    <TableCell>{getBankName(request.accountBank || 'Loading')}</TableCell>
//                   <TableCell>{formatCurrency(request.amount)}</TableCell>
//                   <TableCell> 
//                     {request.approved ? (
//                       <Badge className='bg-green-500 hover:bg-green-600'>Approved</Badge>
//                     ) : (
//                       <Badge className='bg-red-500 hover:bg-red-600'>Not Approved</Badge>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     {request.transferred ? (
//                       <Badge className='bg-green-500 hover:bg-green-600'>Yes</Badge>
//                     ) : (
//                       <Badge className='bg-red-500 hover:bg-red-600'>No</Badge>
//                     )}
//                   </TableCell>
                 
//                   <TableCell>{request.requester_id}</TableCell>
//                   <TableCell className='text-right'>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant='ghost' size='icon'>
//                           <MoreHorizontal className='h-4 w-4' />
//                           <span className='sr-only'>Open menu</span>
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align='end'>
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem 
//                           onClick={() => fetchRequestDetails(request.id)}
//                           disabled={isLoading[request.id]}
//                         >
//                           <Eye className='mr-2 h-4 w-4' />
//                           {isLoading[request.id] ? 'Loading...' : 'View Full Details'}
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         {request.approved ? (
//                           <span className="text-green-600 font-semibold">Approved</span>
//                         ) : request.status === "rejected" ? (
//                           <span className="text-red-600 font-semibold">Rejected</span>
//                         ) : (
//                           <>
//                             <DropdownMenuItem
//                               onClick={() => updatePayoutStatus(request.id, "approved")}
//                             >
//                               <User className='mr-2 h-4 w-4 text-green-500' />
//                               Approve Request
//                             </DropdownMenuItem>

//                             <DropdownMenuItem
//                               onClick={() => updatePayoutStatus(request.id, "rejected")}
//                             >
//                               <Ban className='mr-2 h-4 w-4 text-red-500' />
//                               Reject Request
//                             </DropdownMenuItem>
//                           </>
//                         )}
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   )
// }









// 'use client'

// import { useState, useEffect } from 'react'
// import { Search, MoreHorizontal, Ban, User, Eye } from 'lucide-react'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { Input } from '@/components/ui/input'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'

// // Define student type
// interface Request {
//   id: string
//   requester_id: string
//   amount: number
//   approved: boolean
//   transferred: boolean
//   status: string
//   instructorName?: string
//   accountNumber?: string
//   accountBank?: string
// }

// interface Instructor {
//   id: string
//   fullname: string
//   email: string
//   verified: boolean
//   bank?: {
//     account_number: string
//     account_bank: string
//   }
// }

// interface RequestDetail extends Request {
//   instructor?: Instructor
// }

// export function Payout() {
//   const [requests, setRequests] = useState<Request[]>([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statusFilter, setStatusFilter] = useState('all')
//   const [payoutIds, setPayoutIds] = useState<string[]>([])
//   const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null)
//   const [requestDetails, setRequestDetails] = useState<{[key: string]: RequestDetail}>({})
//   const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({})
//   const [banks, setBanks] = useState<{ code: string, name: string }[]>([]);

//   const pay = payoutIds;
//   console.log(pay)
//   const userData = JSON.parse(localStorage.getItem("user") || "{}")
//   const token = userData.token

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await fetch('https://api.a1schools.org/admin/payout-requests', {
//           method: "GET",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })

//         if (!result.ok) {
//           throw new Error('Failed to fetch setRequest')
//         }

//         const data = await result.json()
//         console.log("Fetched data:", data)

//         if (Array.isArray(data.data) && data.data.length > 0) {
//           setRequests(data.data)
//           setPayoutIds(data.data.map((request: Request) => request.id))
          
//           // Fetch details for each request to get instructor name and account number
//           fetchAllInstructorDetails(data.data)
//         } else {
//           setRequests([])
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error)
//       }
//     }

//     fetchData()
//   }, [])

//   // Fetch instructor details for all requests
//   const fetchAllInstructorDetails = async (requestsData: Request[]) => {
//     try {
//       const detailsPromises = requestsData.map(request => 
//         fetch(`https://api.a1schools.org/admin/payout-requests/${request.id}`, {
//           method: "GET",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }).then(res => {
//           if (!res.ok) throw new Error(`Failed to fetch details for ${request.id}`)
//           return res.json()
//         })
//       )
      
//       const detailsResults = await Promise.allSettled(detailsPromises)
      
//       const updatedRequests = [...requestsData]
      
//       detailsResults.forEach((result, index) => {
//         if (result.status === 'fulfilled' && result.value.data) {
//           const requestId = requestsData[index].id
          
//           // Store complete details in requestDetails state
//           setRequestDetails(prev => ({
//             ...prev,
//             [requestId]: result.value.data
//           }))
          
//           // Update requests with instructor name, account number, and status
//           updatedRequests[index] = {
//             ...updatedRequests[index],
//             instructorName: result.value.data.instructor?.fullname || 'N/A',
//             accountNumber: result.value.data.instructor?.bank?.account_number || 'N/A',
//             accountBank: result.value.data.instructor?.bank?.account_bank || 'N/A',
//             status: result.value.data.status || updatedRequests[index].status // Make sure status is updated
//           }
//         }
//       })
      
//       setRequests(updatedRequests)
//     } catch (error) {
//       console.error("Error fetching instructor details:", error)
//     }
//   }

//   const fetchRequestDetails = async (requestId: string) => {
//     if (requestDetails[requestId]) {
//       // Toggle expanded state if details already loaded
//       setExpandedRequestId(expandedRequestId === requestId ? null : requestId)
//       return
//     }

//     setIsLoading(prev => ({ ...prev, [requestId]: true }))
    
//     try {
//       const response = await fetch(`https://api.a1schools.org/admin/payout-requests/${requestId}`, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error('Failed to fetch request details')
//       }

//       const data = await response.json()
//       console.log(`Details for ${requestId}:`, data)

//       // Update the request with instructor info and status
//       setRequests(prevRequests => 
//         prevRequests.map(req => 
//           req.id === requestId ? {
//             ...req,
//             instructorName: data.data.instructor?.fullname || 'N/A',
//             accountNumber: data.data.instructor?.bank?.account_number || 'N/A',
//             accountBank: data.data.instructor?.bank?.account_bank || 'N/A',
//             status: data.data.status || req.status // Make sure we use the status from API
//           } : req
//         )
//       )

//       setRequestDetails(prev => ({
//         ...prev,
//         [requestId]: data.data
//       }))
      
//       setExpandedRequestId(requestId)
//     } catch (error) {
//       console.error("Error fetching request details:", error)
//     } finally {
//       setIsLoading(prev => ({ ...prev, [requestId]: false }))
//     }
//   }
  
//   const fetchBanks = async () => {
//     try {
//       const response = await fetch('https://api.a1schools.org/utility/get-banks', {
//         method: 'GET',
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to fetch banks');
//       }
  
//       const data = await response.json();
//       setBanks(data.data);
//     } catch (error) {
//       console.error('Error fetching banks:', error);
//     }
//   };

//   useEffect(() => {
//     fetchBanks();
//   }, []);

//   const getBankName = (accountBank: string) => {
//     const bank = banks.find(b => b.code === accountBank);
//     return bank ? bank.name : 'Unknown Bank';
//   };

//   const updatePayoutStatus = async (payoutId: string, action: "approved" | "rejected") => {
//     try {
//       const response = await fetch(`https://api.a1schools.org/admin/payout-requests/${payoutId}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: action }),
//       })

//       if (!response.ok) {
//         throw new Error('Failed to update payout status')
//       }

//       // Update both status and approved flag based on the action
//       setRequests((prevRequests) =>
//         prevRequests.map((r) =>
//           r.id === payoutId ? { 
//             ...r, 
//             status: action,
//             approved: action === "approved" 
//           } : r
//         )
//       )

//       if (requestDetails[payoutId]) {
//         setRequestDetails(prev => ({
//           ...prev,
//           [payoutId]: { 
//             ...prev[payoutId], 
//             status: action,
//             approved: action === "approved" 
//           }
//         }))
//       }

//       const data = await response.json()
//       console.log(`${action} successful`, data)
//     } catch (error) {
//       console.error('Error updating payout:', error)
//     }
//   }
 
//   const filteredRequests = requests.filter((request) => {
//     // Search by amount or instructor name
//     const matchesSearch = 
//       request?.amount?.toString()?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (request?.instructorName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
//     // Filter by status - handling all possible statuses
//     let matchesStatus = false;
//     if (statusFilter === 'all') {
//       matchesStatus = true;
//     } else if (statusFilter === 'approved') {
//       matchesStatus = request.status === 'approved';
//     } else if (statusFilter === 'rejected') {
//       matchesStatus = request.status === 'rejected';
//     } else if (statusFilter === 'pending') {
//       // If status is not set or neither approved nor rejected
//       matchesStatus = !request.status || (request.status !== 'approved' && request.status !== 'rejected');
//     }

//     return matchesSearch && matchesStatus;
//   });
 
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(amount)
//   }

//   // Helper function to determine status badge
//   const getStatusBadge = (request: Request) => {
//     if (request.status === 'approved') {
//       return <Badge className='bg-green-500 hover:bg-green-600'>Approved</Badge>;
//     } else if (request.status === 'rejected') {
//       return <Badge className='bg-red-500 hover:bg-red-600'>Rejected</Badge>;
//     } else if (request.status === 'pending') {
//       return <Badge className='bg-yellow-500 hover:bg-yellow-600'>Pending</Badge>;
//     }
//   };

//   return (
//     <div className='space-y-4'>
//       <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
//         <div className='relative w-full sm:w-64'>
//           <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
//           <Input
//             type='search'
//             placeholder='Search amounts or instructors...'
//             className='w-full pl-8'
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className='w-full sm:w-40'>
//             <SelectValue placeholder='Filter by status' />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value='all'>All Requests</SelectItem>
//             <SelectItem value='approved'>Approved</SelectItem>
//             <SelectItem value='rejected'>Rejected</SelectItem>
//             <SelectItem value='pending'>Pending</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className='rounded-md border'>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Instructor Name</TableHead>
//               <TableHead>Account Number</TableHead>
//               <TableHead>Bank Name</TableHead>
//               <TableHead>Amount</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Transferred</TableHead>           
//               <TableHead>Requester ID</TableHead>
//               <TableHead className='text-right'>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredRequests.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={8}
//                   className='py-8 text-center text-muted-foreground'
//                 >
//                   No requests found matching your criteria
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredRequests.map((request) => (
//                 <TableRow key={request.id}>
//                   <TableCell>{request.instructorName || 'Loading...'}</TableCell>
//                   <TableCell>{request.accountNumber || 'Loading...'}</TableCell>
//                   <TableCell>{getBankName(request.accountBank || '')}</TableCell>
//                   <TableCell>{formatCurrency(request.amount)}</TableCell>
//                   <TableCell>{getStatusBadge(request)}</TableCell>
//                   <TableCell>
//                     {request.transferred ? (
//                       <Badge className='bg-green-500 hover:bg-green-600'>Yes</Badge>
//                     ) : (
//                       <Badge className='bg-red-500 hover:bg-red-600'>No</Badge>
//                     )}
//                   </TableCell>
//                   <TableCell>{request.requester_id}</TableCell>
//                   <TableCell className='text-right'>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant='ghost' size='icon'>
//                           <MoreHorizontal className='h-4 w-4' />
//                           <span className='sr-only'>Open menu</span>
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align='end'>
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem 
//                           onClick={() => fetchRequestDetails(request.id)}
//                           disabled={isLoading[request.id]}
//                         >
//                           <Eye className='mr-2 h-4 w-4' />
//                           {isLoading[request.id] ? 'Loading...' : 'View Full Details'}
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         {request.status === 'approved' ? (
//                           <span className="text-green-600 font-semibold px-2 py-1">Approved</span>
//                         ) : request.status === 'rejected' ? (
//                           <span className="text-red-600 font-semibold px-2 py-1">Rejected</span>
//                         ) : (
//                           <>
//                             <DropdownMenuItem
//                               onClick={() => updatePayoutStatus(request.id, "approved")}
//                             >
//                               <User className='mr-2 h-4 w-4 text-green-500' />
//                               Approve Request
//                             </DropdownMenuItem>

//                             <DropdownMenuItem
//                               onClick={() => updatePayoutStatus(request.id, "rejected")}
//                             >
//                               <Ban className='mr-2 h-4 w-4 text-red-500' />
//                               Reject Request
//                             </DropdownMenuItem>
//                           </>
//                         )}
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   )
// }








'use client'

import { useState, useEffect } from 'react'
import { Search, MoreHorizontal, Ban, User, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast, Toaster } from 'react-hot-toast';
// Define student type
interface Request {
  id: string
  requester_id: string
  amount: number
  approved: boolean
  transferred: boolean
  status: string
  instructorName?: string
  accountNumber?: string
  accountBank?: string
  rejectionReason?: string
}

interface Instructor {
  id: string
  fullname: string
  email: string
  verified: boolean
  bank?: {
    account_number: string
    account_bank: string
  }
}

interface RequestDetail extends Request {
  instructor?: Instructor
}

export function Payout() {
  const [requests, setRequests] = useState<Request[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [payoutIds, setPayoutIds] = useState<string[]>([])
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null)
  const [requestDetails, setRequestDetails] = useState<{[key: string]: RequestDetail}>({})
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({})
  const [banks, setBanks] = useState<{ code: string, name: string }[]>([]);

  // Rejection modal states
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null)
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false)

  const pay = payoutIds;
  console.log(pay)
  const userData = JSON.parse(localStorage.getItem("user") || "{}")
  const token = userData.token

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch('https://api.a1schools.org/admin/payout-requests', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!result.ok) {
          throw new Error('Failed to fetch setRequest')
        }

        const data = await result.json()
        console.log("Fetched data:", data)

        if (Array.isArray(data.data) && data.data.length > 0) {
          setRequests(data.data)
          setPayoutIds(data.data.map((request: Request) => request.id))
          
          // Fetch details for each request to get instructor name and account number
          fetchAllInstructorDetails(data.data)
        } else {
          setRequests([])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  // Fetch instructor details for all requests
  const fetchAllInstructorDetails = async (requestsData: Request[]) => {
    try {
      const detailsPromises = requestsData.map(request => 
        fetch(`https://api.a1schools.org/admin/payout-requests/${request.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).then(res => {
          if (!res.ok) throw new Error(`Failed to fetch details for ${request.id}`)
          return res.json()
        })
      )
      
      const detailsResults = await Promise.allSettled(detailsPromises)
      
      const updatedRequests = [...requestsData]
      
      detailsResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.data) {
          const requestId = requestsData[index].id
          
          // Store complete details in requestDetails state
          setRequestDetails(prev => ({
            ...prev,
            [requestId]: result.value.data
          }))
          
          // Update requests with instructor name, account number, and status
          updatedRequests[index] = {
            ...updatedRequests[index],
            instructorName: result.value.data.instructor?.fullname || 'N/A',
            accountNumber: result.value.data.instructor?.bank?.account_number || 'N/A',
            accountBank: result.value.data.instructor?.bank?.account_bank || 'N/A',
            status: result.value.data.status || updatedRequests[index].status // Make sure status is updated
          }
        }
      })
      
      setRequests(updatedRequests)
    } catch (error) {
      console.error("Error fetching instructor details:", error)
    }
  }

  const fetchRequestDetails = async (requestId: string) => {
    if (requestDetails[requestId]) {
      // Toggle expanded state if details already loaded
      setExpandedRequestId(expandedRequestId === requestId ? null : requestId)
      return
    }

    setIsLoading(prev => ({ ...prev, [requestId]: true }))
    
    try {
      const response = await fetch(`https://api.a1schools.org/admin/payout-requests/${requestId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch request details')
      }

      const data = await response.json()
      console.log(`Details for ${requestId}:`, data)

      // Update the request with instructor info and status
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? {
            ...req,
            instructorName: data.data.instructor?.fullname || 'N/A',
            accountNumber: data.data.instructor?.bank?.account_number || 'N/A',
            accountBank: data.data.instructor?.bank?.account_bank || 'N/A',
            status: data.data.status || req.status // Make sure we use the status from API
          } : req
        )
      )

      setRequestDetails(prev => ({
        ...prev,
        [requestId]: data.data
      }))
      
      setExpandedRequestId(requestId)
    } catch (error) {
      console.error("Error fetching request details:", error)
    } finally {
      setIsLoading(prev => ({ ...prev, [requestId]: false }))
    }
  }
  
  const fetchBanks = async () => {
    try {
      const response = await fetch('https://api.a1schools.org/utility/get-banks', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch banks');
      }
  
      const data = await response.json();
      setBanks(data.data);
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const getBankName = (accountBank: string) => {
    const bank = banks.find(b => b.code === accountBank);
    return bank ? bank.name : 'Unknown Bank';
  };

  const updatePayoutStatus = async (payoutId: string, action: "approved" | "rejected", reason?: string) => {
    try {
      // Prepare the payload - include rejection reason if provided
      const payload: { status: string; rejectionReason?: string } = {
        status: action
      };
      
      if (action === "rejected" && reason) {
        payload.rejectionReason = reason;
      }
      
      const response = await fetch(`https://api.a1schools.org/admin/payout-requests/${payoutId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to update payout status')
      }

      // Update both status and approved flag based on the action
      setRequests((prevRequests) =>
        prevRequests.map((r) =>
          r.id === payoutId ? { 
            ...r, 
            status: action,
            approved: action === "approved",
            rejectionReason: action === "rejected" ? reason : r.rejectionReason
          } : r
        )
      )

      if (requestDetails[payoutId]) {
        setRequestDetails(prev => ({
          ...prev,
          [payoutId]: { 
            ...prev[payoutId], 
            status: action,
            approved: action === "approved",
            rejectionReason: action === "rejected" ? reason : prev[payoutId].rejectionReason 
          }
        }))
      }

      const data = await response.json()
      console.log(`${action} successful`, data)
    } catch (error) {
      console.error('Error updating payout:', error)
    }
  }

  // Function to handle showing rejection modal
  const handleRejectClick = (requestId: string) => {
    setCurrentRequestId(requestId)
    setRejectionReason('')
    setRejectModalOpen(true)
  }

  // Function to handle rejection submission
  // const handleRejectionSubmit = async () => {
  //   if (!currentRequestId) return
    
  //   setIsSubmittingRejection(true)
    
  //   try {
  //     await updatePayoutStatus(currentRequestId, "rejected", rejectionReason)
  //     setRejectModalOpen(false)
  //     setRejectionReason('')
  //     setCurrentRequestId(null)
  //   } catch (error) {
  //     console.error("Error rejecting payout:", error)
  //   } finally {
  //     setIsSubmittingRejection(false)
  //   }
  // }
 


// Function to handle rejection submission
const handleRejectionSubmit = async () => {
  if (!currentRequestId) return
  
  setIsSubmittingRejection(true)
  
  try {
    // Step 1: Reject the payout request
    const rejectResponse = await fetch(`https://api.a1schools.org/admin/payout-requests/${currentRequestId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: "rejected",
        rejectionReason: rejectionReason
      }),
    });

    if (!rejectResponse.ok) {
      throw new Error('Failed to reject payout');
    }

    const rejectData = await rejectResponse.json();
    
    // Update UI states
    setRequests((prevRequests) =>
      prevRequests.map((r) =>
        r.id === currentRequestId ? { 
          ...r, 
          status: "rejected",
          approved: false,
          rejectionReason: rejectionReason
        } : r
      )
    );

    if (requestDetails[currentRequestId]) {
      setRequestDetails(prev => ({
        ...prev,
        [currentRequestId]: { 
          ...prev[currentRequestId], 
          status: "rejected",
          approved: false,
          rejectionReason: rejectionReason
        }
      }));
    }
    
    // Show toast for successful rejection
    toast.success('Payout request rejected successfully');

    // Step 2: Get the instructor/user ID from request details
    const userId = requestDetails[currentRequestId]?.instructor?.id;
    
    if (!userId) {
      console.error("Could not find user ID for notification");
      toast.error('Could not find user ID for notification');
      throw new Error("User ID not found");
    }

    // Step 3: Create a notification
    const notificationPayload = {
      title: "Payout Request Rejected",
      message: `Your payout request has been rejected. Reason: ${rejectionReason}`,
      type: "payout_rejection"
    };

    const notificationResponse = await fetch('https://api.a1schools.org/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationPayload),
    });

    if (!notificationResponse.ok) {
      throw new Error('Failed to create notification');
    }

    const notificationData = await notificationResponse.json();
    const notificationId = notificationData.data.id;
    
    // Show toast for successful notification creation
    toast.success('Notification created successfully');

    // Step 4: Send the notification to the user
    const sendNotificationResponse = await fetch(`https://api.a1schools.org/notifications/${notificationId}/send/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!sendNotificationResponse.ok) {
      throw new Error('Failed to send notification to user');
    }

    console.log("Rejection process completed successfully");
    toast.success('Notification sent to user successfully');
    
    // Close modal and reset states
    setRejectModalOpen(false);
    setRejectionReason('');
    setCurrentRequestId(null);
  } catch (error) {
    console.error("Error in rejection process:", error);
    toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
  } finally {
    setIsSubmittingRejection(false);
  }
}

  const filteredRequests = requests.filter((request) => {
    // Search by amount or instructor name
    const matchesSearch = 
      request?.amount?.toString()?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request?.instructorName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    // Filter by status - handling all possible statuses
    let matchesStatus = false;
    if (statusFilter === 'all') {
      matchesStatus = true;
    } else if (statusFilter === 'approved') {
      matchesStatus = request.status === 'approved';
    } else if (statusFilter === 'rejected') {
      matchesStatus = request.status === 'rejected';
    } else if (statusFilter === 'pending') {
      // If status is not set or neither approved nor rejected
      matchesStatus = !request.status || (request.status !== 'approved' && request.status !== 'rejected');
    }

    return matchesSearch && matchesStatus;
  });
 
  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //   }).format(amount)
  // }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  // Helper function to determine status badge
  const getStatusBadge = (request: Request) => {
    if (request.status === 'approved') {
      return <Badge className='bg-green-500 hover:bg-green-600'>Approved</Badge>;
    } else if (request.status === 'rejected') {
      return <Badge className='bg-red-500 hover:bg-red-600'>Rejected</Badge>;
    } else if (request.status === 'pending') {
      return <Badge className='bg-yellow-500 hover:bg-yellow-600'>Pending</Badge>;
    }
  };

  return (
    <div className='space-y-4'>
      <Toaster position="top-right" />
      <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <div className='relative w-full sm:w-64'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Search amounts or instructors...'
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
            <SelectItem value='approved'>Approved</SelectItem>
            <SelectItem value='rejected'>Rejected</SelectItem>
            <SelectItem value='pending'>Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Instructor Name</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>Bank Name</TableHead>
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
                  colSpan={8}
                  className='py-8 text-center text-muted-foreground'
                >
                  No requests found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.instructorName || 'Loading...'}</TableCell>
                  <TableCell>{request.accountNumber || 'Loading...'}</TableCell>
                  <TableCell>{getBankName(request.accountBank || '')}</TableCell>
                  <TableCell>{formatCurrency(request.amount)}</TableCell>
                  <TableCell>{getStatusBadge(request)}</TableCell>
                  <TableCell>
                    {request.transferred ? (
                      <Badge className='bg-green-500 hover:bg-green-600'>Yes</Badge>
                    ) : (
                      <Badge className='bg-red-500 hover:bg-red-600'>No</Badge>
                    )}
                  </TableCell>
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
                        <DropdownMenuItem 
                          onClick={() => fetchRequestDetails(request.id)}
                          disabled={isLoading[request.id]}
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          {isLoading[request.id] ? 'Loading...' : 'View Full Details'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {request.status === 'approved' ? (
                          <span className="text-green-600 font-semibold px-2 py-1">Approved</span>
                        ) : request.status === 'rejected' ? (
                          <span className="text-red-600 font-semibold px-2 py-1">Rejected</span>
                        ) : (
                          <>
                            <DropdownMenuItem
                              onClick={() => updatePayoutStatus(request.id, "approved")}
                            >
                              <User className='mr-2 h-4 w-4 text-green-500' />
                              Approve Request
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleRejectClick(request.id)}
                            >
                              <Ban className='mr-2 h-4 w-4 text-red-500' />
                              Reject Request
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Rejection Reason Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Payout Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payout request.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-24"
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setRejectModalOpen(false)}
              disabled={isSubmittingRejection}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleRejectionSubmit}
              disabled={!rejectionReason.trim() || isSubmittingRejection}
            >
              {isSubmittingRejection ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}