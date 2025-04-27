import { useEffect ,useState } from 'react'
import { Users, GraduationCap, DollarSign, AlertCircle } from 'lucide-react'
// import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
// import { TopNav } from '@/components/layout/top-nav'
// import { ProfileDropdown } from '@/components/profile-dropdown'
// import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ApprovedInstructors } from './components/approved-instructors'
import { InstructorTable } from './components/instructor-table'
import { Overview } from './components/overview'
import { StudentTable } from './components/student-table'
import { Payout } from './components/payout'
// import { boolean } from 'zod'
// import { boolean } from 'zod'
// import { getAuthData } from '../auth/sign-in/authData'

type Itemf = {
  transferred?: boolean
  amount?: number
}

export default function Dashboard() {
    const [students, setStudents] = useState([])
      const [instructors, setInstructors] = useState([])
     const [totalPayout , setTotalPayout] = useState()
      const [failedTransactions , setFailedTransactions] = useState()

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
  
  
  
      
       
  
        
  
      } catch (error) {
        console.error("Error fetching data:", error);
      
      }
    };
  
    fetchData();
  }, []);



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
  
  
  
      
  
  
        
      } catch (error) {
        console.error("Error fetching data:", error);
        
      }
    };
  
    fetchData();
  }, []);
  


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
        console.log("Fetched data:", data);
  
        if (Array.isArray(data.data) && data.data.length > 0) {
          
          // Calculate total amount where transferred is true
          // const totalTransferredAmount = data.data
            
          //   .filter((item: Itemf) => item.transferred === true)
          //   .reduce((sum: number, item: Itemf) => sum + (item.amount ?? 0), 0);

          const items = data.data;
      const totalTransferredAmount = items
      .filter((item: Itemf) => item.transferred)
      .reduce((sum: number, item: Itemf) => {
        const amount = typeof item.amount === "string" ? parseFloat(item.amount) : item.amount ?? 0;
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
            setTotalPayout(totalTransferredAmount)
          console.log("Total transferred amount:", totalTransferredAmount);
       
          const failedTransactionCount = data.data.filter((item: Itemf )=> item.transferred === false).length;
          setFailedTransactions(failedTransactionCount);
          console.log("Failed transaction count:", failedTransactionCount);
        } else {
          
        }
  
      } catch (error) {
        console.error("Error fetching data:", error);
        
      }
    };
  
    fetchData();
  }, []);
  

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
  return (
    <div>
      {/* ===== Top Heading ===== */}
      <Header>
        {/* <TopNav links={topNav} /> */}
        <div className='ml-auto flex items-center space-x-4'>
          {/* <Search /> */}
          <ThemeSwitch />
          {/* <ProfileDropdown /> */}
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            {/* <Button>Download</Button> */}
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='students'>Students</TabsTrigger>
              <TabsTrigger value='instructors'>Instructors</TabsTrigger>
              <TabsTrigger value='payout'>Payout Request</TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Reports
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Students
                  </CardTitle>
                  <Users className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{students.length}</div>
                  
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Instructors
                  </CardTitle>
                  <GraduationCap className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{instructors.length}</div>
                  
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Payout
                  </CardTitle>
                  <DollarSign className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {formatCurrency(totalPayout || 0) }
                    {/* {totalPayout || 0} */}
                    </div>
                  
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Failed Transactions
                  </CardTitle>
                  <AlertCircle className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{failedTransactions}</div>
                 
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Approved Instructors</CardTitle>
                  <CardDescription>
                    Top performing instructors on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ApprovedInstructors />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='students' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>
                  View student information, purchases, and manage access to the
                  platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StudentTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='instructors' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Instructor Management</CardTitle>
                <CardDescription>
                  Approve or reject instructor applications and manage existing
                  instructors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InstructorTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='payout' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Payout Requests</CardTitle>
                <CardDescription>
                  Approve or reject Payout Request 
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Payout />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </div>
  )
}

// const topNav = [
//   {
//     title: 'Overview',
//     href: 'dashboard/overview',
//     isActive: true,
//     disabled: false,
//   },
//   {
//     title: 'Students',
//     href: 'dashboard/students',
//     isActive: false,
//     disabled: false,
//   },
//   {
//     title: 'Courses',
//     href: 'dashboard/courses',
//     isActive: false,
//     disabled: false,
//   },
//   {
//     title: 'Settings',
//     href: 'dashboard/settings',
//     isActive: false,
//     disabled: false,
//   },
// ]
