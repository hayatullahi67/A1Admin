import { useEffect , useState} from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function ApprovedInstructors() {
  
    const [instructors, setInstructors] = useState<any[]>([])
     const [courses, setCourses] = useState([])  

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
          const verifiedInstructors = data.data.filter(instructor => instructor.verified === true);
          setInstructors(verifiedInstructors);
                      
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

  return (
    <div className='space-y-4'>
      {instructors.map((instructor) => (
        <div key={instructor.id} className='flex items-center'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={instructor.avatar} alt={instructor.name} />
            <AvatarFallback>{instructor.fullname.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {instructor.fullname}
            </p>
            <p className='text-sm text-muted-foreground'>
              {instructor.expertise}
            </p>
          </div>
          <div className='ml-auto text-right text-sm'>
            <p className='font-medium'> {courses[instructor.id]?.length || 0}            courses</p>
            
          </div>
        </div>
      ))}
    </div>
  )
}
