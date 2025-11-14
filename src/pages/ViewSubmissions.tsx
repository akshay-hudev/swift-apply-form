import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Registration {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  course: string;
  address: string;
  submittedAt: string;
}

const ViewSubmissions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("registrations") || "[]");
    setRegistrations(data);
    setFilteredRegistrations(data);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRegistrations(registrations);
    } else {
      const filtered = registrations.filter((reg) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          reg.fullName.toLowerCase().includes(searchLower) ||
          reg.email.toLowerCase().includes(searchLower) ||
          reg.phone.includes(searchTerm) ||
          reg.gender.toLowerCase().includes(searchLower) ||
          reg.course.toLowerCase().includes(searchLower) ||
          reg.address.toLowerCase().includes(searchLower)
        );
      });
      setFilteredRegistrations(filtered);
    }
  }, [searchTerm, registrations]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const handleDelete = (id: number) => {
    const updated = registrations.filter((reg) => reg.id !== id);
    localStorage.setItem("registrations", JSON.stringify(updated));
    setRegistrations(updated);
    setFilteredRegistrations(updated.filter((reg) => {
      if (searchTerm.trim() === "") return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        reg.fullName.toLowerCase().includes(searchLower) ||
        reg.email.toLowerCase().includes(searchLower) ||
        reg.phone.includes(searchTerm) ||
        reg.gender.toLowerCase().includes(searchLower) ||
        reg.course.toLowerCase().includes(searchLower) ||
        reg.address.toLowerCase().includes(searchLower)
      );
    }));
    toast({
      title: "Submission deleted",
      description: "The registration has been removed successfully.",
    });
  };

  const handleEdit = (reg: Registration) => {
    localStorage.setItem("editingSubmission", JSON.stringify(reg));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="bg-primary text-primary-foreground py-4 px-6 rounded-t-lg mb-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">All Submissions</h1>
              <p className="text-sm opacity-90">
                Total Registrations: {registrations.length}
              </p>
            </div>
            <Button
              onClick={() => navigate("/")}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              New Application
            </Button>
          </div>
        </div>

        {/* Search Card */}
        <Card className="p-6 rounded-t-none rounded-b-none border-b-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, email, phone, gender, course, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Table Card */}
        <Card className="rounded-t-none shadow-lg overflow-hidden">
          {filteredRegistrations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm ? "No results found" : "No submissions yet"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-bold">#</TableHead>
                    <TableHead className="font-bold">Full Name</TableHead>
                    <TableHead className="font-bold">Email</TableHead>
                    <TableHead className="font-bold">Phone</TableHead>
                    <TableHead className="font-bold">Gender</TableHead>
                    <TableHead className="font-bold">Course</TableHead>
                    <TableHead className="font-bold">Address</TableHead>
                    <TableHead className="font-bold">Submitted At</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((reg, index) => (
                    <TableRow key={reg.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{reg.fullName}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>{reg.phone}</TableCell>
                      <TableCell className="capitalize">{reg.gender}</TableCell>
                      <TableCell>{reg.course}</TableCell>
                      <TableCell className="max-w-xs truncate">{reg.address}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(reg.submittedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(reg)}
                            title="Edit submission"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(reg.id)}
                            title="Delete submission"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ViewSubmissions;
