import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface SubmissionData {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  course: string;
  address: string;
  submittedAt: string;
}

const Success = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<SubmissionData | null>(null);

  useEffect(() => {
    const lastSubmission = localStorage.getItem("lastSubmission");
    if (lastSubmission) {
      setData(JSON.parse(lastSubmission));
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!data) {
    return null;
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="bg-primary text-primary-foreground py-4 px-6 rounded-t-lg mb-0">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Application Submitted Successfully!</h1>
              <p className="text-sm opacity-90">Your registration has been received</p>
            </div>
          </div>
        </div>

        {/* Data Card */}
        <Card className="p-8 rounded-t-none shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-primary">Submission Details</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 py-3 border-b">
              <div className="font-semibold text-muted-foreground">Full Name:</div>
              <div className="col-span-2 font-medium">{data.fullName}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-b">
              <div className="font-semibold text-muted-foreground">Email:</div>
              <div className="col-span-2 font-medium">{data.email}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-b">
              <div className="font-semibold text-muted-foreground">Phone:</div>
              <div className="col-span-2 font-medium">{data.phone}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-b">
              <div className="font-semibold text-muted-foreground">Gender:</div>
              <div className="col-span-2 font-medium capitalize">{data.gender}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-b">
              <div className="font-semibold text-muted-foreground">Course:</div>
              <div className="col-span-2 font-medium">{data.course}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-b">
              <div className="font-semibold text-muted-foreground">Address:</div>
              <div className="col-span-2 font-medium">{data.address}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-b">
              <div className="font-semibold text-muted-foreground">Submitted At:</div>
              <div className="col-span-2 font-medium">{formatDate(data.submittedAt)}</div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button onClick={() => navigate("/")} className="flex-1">
              Submit Another Application
            </Button>
            <Button onClick={() => navigate("/view")} variant="outline" className="flex-1">
              View All Submissions
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Success;
