import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Search, Users, Clock, CheckCircle2, UserCheck, ExternalLink, Trash2 } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { Candidate } from '@/types';
import { getToken, isAuthenticated } from '@/lib/auth';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function DashboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
 

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/candidates`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch candidates');
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCandidate = async (candidateId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/candidates/${candidateId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete candidate');

      setCandidates(candidates.filter(candidate => candidate._id !== candidateId));
      toast.success('Candidate deleted successfully');
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast.error('Failed to delete candidate');
    } 
  };


  const updateCandidateStatus = async (candidateId: string, newStatus: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/candidates/${candidateId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setCandidates(candidates.map(candidate =>
        candidate._id === candidateId
          ? { ...candidate, status: newStatus as Candidate['status'] }
          : candidate
      ));
    } catch (error) {
      console.error('Error updating candidate status:', error);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'Reviewed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Reviewed</Badge>;
      case 'Hired':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Hired</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  const metrics = {
    total: candidates.length,
    pending: candidates.filter(c => c.status === 'Pending').length,
    reviewed: candidates.filter(c => c.status === 'Reviewed').length,
    hired: candidates.filter(c => c.status === 'Hired').length,
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[50px]" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className=" mx-auto px-6 py-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  Candidates
                </h2>
                <p className="text-gray-500 mt-1">Manage your referrals and track their status</p>
              </div>
              <Link to="/dashboard/refer">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Refer Candidate
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                      <Users className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metrics.total}</div>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent>
                  View all your referred candidates
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metrics.pending}</div>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent>
                  Candidates awaiting initial review
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metrics.reviewed}</div>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent>
                  Candidates that have been reviewed
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Hired</CardTitle>
                      <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metrics.hired}</div>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent>
                  Successfully hired candidates
                </HoverCardContent>
              </HoverCard>
            </div>

            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Reviewed">Reviewed</SelectItem>
                  <SelectItem value="Hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCandidates.map((candidate) => (
                <Card key={candidate._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{candidate.name}</h3>
                        <p className="text-gray-600">{candidate.jobTitle}</p>
                      </div>
                      <div className='flex flex-col py-1 justify-between items-end'>
                      {getStatusBadge(candidate.status)}
                      <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {candidate.name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => deleteCandidate(candidate._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <span>📧</span> {candidate.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <span>📱</span> {candidate.phoneNumber}
                      </p>
                      {candidate.resumeUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => window.open(candidate.resumeUrl, '_blank')}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Resume
                        </Button>
                      )}
                    </div>
                    <div className="mt-4">
                      <Select
                        value={candidate.status}
                        onValueChange={(value) => {updateCandidateStatus(candidate._id, value)}}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Reviewed">Reviewed</SelectItem>
                          <SelectItem value="Hired">Hired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {filteredCandidates.length === 0 && (
              <Card className="py-12">
                <CardContent className="text-center text-gray-500">
                  <p>No candidates found</p>
                </CardContent>
              </Card>
            )}
      </main>
    </div>
  );
}