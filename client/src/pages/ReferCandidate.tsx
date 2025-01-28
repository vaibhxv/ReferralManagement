import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getToken, isAuthenticated } from '@/lib/auth';
import { ArrowLeft } from 'lucide-react';
import { Card, CardDescription, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from 'sonner';

const countryCodes = [
  { code: '+91', flag: '🇮🇳', country: 'India' },
  { code: '+1', flag: '🇺🇸', country: 'USA' },
  { code: '+44', flag: '🇬🇧', country: 'UK' },
  { code: '+61', flag: '🇦🇺', country: 'Australia' },
  { code: '+86', flag: '🇨🇳', country: 'China' },
  { code: '+81', flag: '🇯🇵', country: 'Japan' },
  { code: '+49', flag: '🇩🇪', country: 'Germany' },
  { code: '+33', flag: '🇫🇷', country: 'France' },
  { code: '+7', flag: '🇷🇺', country: 'Russia' },
  { code: '+55', flag: '🇧🇷', country: 'Brazil' },
];

const formSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
  email: z.string()
    .email('Please enter a valid email address'),
  countryCode: z.string(),
  phoneNumber: z.string()
    .regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number'),
  jobTitle: z.string()
    .min(2, 'Job title must be at least 2 characters'),
  resume: z.any()
    .refine((file) => !file || file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => !file || file.type === 'application/pdf',
      'Only PDF files are allowed'
    )
});

type FormValues = z.infer<typeof formSchema>;

export function ReferCandidatePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      countryCode: '+91',
      phoneNumber: '',
      jobTitle: '',
      resume: null,
    },
  });

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue('resume', file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phoneNumber', `${data.countryCode}${data.phoneNumber}`);
    formData.append('jobTitle', data.jobTitle);
    if (selectedFile) {
      formData.append('resume', selectedFile);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/candidates`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to refer candidate');

      toast.success('Candidate referred successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error referring candidate:', error);
      toast.error('Failed to refer candidate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Refer a Candidate
              </CardTitle>
              <CardDescription>
                Help us find great talent by referring someone you know
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name="countryCode"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue>
                                  {countryCodes.find(c => c.code === field.value)?.flag} {field.value}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {countryCodes.map((country) => (
                                  <SelectItem
                                    key={country.code}
                                    value={country.code}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span>{country.flag}</span>
                                      <span>{country.code}</span>
                                      <span className="text-gray-500 text-sm">({country.country})</span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="1234567890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Senior Developer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="resume"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Resume</FormLabel>
                          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label
                                  htmlFor="resume"
                                  className="relative cursor-pointer rounded-md bg-white font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                                >
                                  <span>Upload a file</span>
                                  <Input
                                    id="resume"
                                    type="file"
                                    accept=".pdf"
                                    className="sr-only"
                                    onChange={handleFileSelect}
                                    {...field}
                                  />
                                </label>
                              </div>
                              <p className="text-xs leading-5 text-gray-600">PDF up to 5MB</p>
                              {selectedFile && (
                                <p className="mt-2 text-sm text-gray-600">
                                  Selected: {selectedFile.name}
                                </p>
                              )}
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">⚪</span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Referral'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}