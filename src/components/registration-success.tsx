import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/lib/paths";
import { REGISTRATION_STATUS } from "@/lib/firestore-constants";

interface RegistrationSuccessProps {
  status: string;
  teacherEmail?: string;
  schoolId?: string;
}

export function RegistrationSuccess({ status, teacherEmail, schoolId }: RegistrationSuccessProps) {
  const isApproved = status === REGISTRATION_STATUS.APPROVED;
  
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className={`text-2xl font-bold ${
            isApproved ? "text-green-600" : "text-red-600"
          }`}>
            {isApproved ? "Registration Approved!" : "Registration Rejected"}
          </CardTitle>
          <CardDescription>
            {isApproved 
              ? "The teacher has been successfully added to your school"
              : "The registration request has been rejected"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {teacherEmail && (
            <div className="text-muted-foreground">
              <p className="font-medium">{teacherEmail}</p>
              {isApproved && schoolId && (
                <p className="text-sm">has been assigned to school: {schoolId}</p>
              )}
            </div>
          )}
          
          {isApproved && (
            <div className="bg-green-50 text-green-800 p-3 rounded text-sm">
              The teacher can now access the full iOS app with their school account.
            </div>
          )}
          
          <Button asChild className="w-full">
            <Link href={ROUTES.HOME}>
              Back to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}