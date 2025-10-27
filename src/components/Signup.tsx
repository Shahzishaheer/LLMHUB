import { SignUp } from '@clerk/clerk-react';

import { type JSX} from 'react';

// import { Link } from 'react-router-dom';
// type SignupFormData = {
//     fullName: string;
//     email: string;
//     password: string;
//     confirmPassword: string;
// };
const Signup = ():JSX.Element => {
//   const [formData, setFormData] = useState<SignupFormData>({
//     fullName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState<{[key: string]: string}>({});

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     // Clear error when user starts typing
//     if (errors[e.target.name]) {
//       setErrors({ ...errors, [e.target.name]: '' });
//     }
//   };

//   const validateForm = () => {
//     const newErrors: {[key: string]: string} = {};

//     if (formData.fullName.trim().length < 2) {
//       newErrors.fullName = 'Name must be at least 2 characters';
//     }

//     if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email';
//     }

//     if (formData.password.length < 8) {
//       newErrors.password = 'Password must be at least 8 characters';
//     }

//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     setIsLoading(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       console.log('Signup data:', formData);
//       setIsLoading(false);
//       // Handle signup logic here
//     }, 1500);
//   };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
       <SignUp path="/signup" routing="path" />
    </div>
  );
};

// export default Signup;



export default Signup;