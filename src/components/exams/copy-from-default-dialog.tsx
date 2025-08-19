"use client";

import { useState } from "react";
import { Exam } from "@/types/school";
import { useDefaultExams } from "@/hooks/useDefaultExams";
import { useExamMutations } from "@/hooks/useExams";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Check } from "lucide-react";

interface CopyFromDefaultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
  subjectId: string;
  onSuccess: () => void;
}

export function CopyFromDefaultDialog({
  open,
  onOpenChange,
  schoolId,
  subjectId,
  onSuccess,
}: CopyFromDefaultDialogProps) {
  const {
    defaultExams,
    loading: defaultExamsLoading,
    error: defaultExamsError,
  } = useDefaultExams(schoolId);
  const {
    createFromDefault,
    loading: copyLoading,
    error: copyError,
  } = useExamMutations(schoolId, subjectId);

  const [isCopying, setIsCopying] = useState(false);
  const [copiedCount, setCopiedCount] = useState(0);

  const handleCopyAll = async () => {
    if (defaultExams.length === 0) return;

    setIsCopying(true);
    setCopiedCount(0);
    
    try {
      for (let i = 0; i < defaultExams.length; i++) {
        const exam = defaultExams[i];
        await createFromDefault(exam);
        setCopiedCount(i + 1);
      }
    } catch (error) {
      console.error("Failed to copy exams:", error);
    } finally {
      setIsCopying(false);
    }
  };

  const handleClose = () => {
    setCopiedCount(0);
    setIsCopying(false);
    onOpenChange(false);
    if (copiedCount > 0) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Copy from Default Exams</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {defaultExamsLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-9 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : defaultExamsError ? (
            <div className="text-center py-8">
              <div className="text-destructive mb-4">
                Error loading default exams: {defaultExamsError}
              </div>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          ) : defaultExams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">No default exams found.</p>
              <p className="text-sm">
                Create default exams first to copy them to subjects.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">
                  {defaultExams.length} Default Exam{defaultExams.length === 1 ? '' : 's'} Available
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This will copy all default exams to this subject. You can edit them individually afterwards.
                </p>
                
                {isCopying && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Copying exams... ({copiedCount}/{defaultExams.length})</span>
                    </div>
                  </div>
                )}
                
                {copiedCount > 0 && !isCopying && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="h-4 w-4" />
                      <span>Successfully copied {copiedCount} exam{copiedCount === 1 ? '' : 's'}!</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCopyAll}
                  disabled={isCopying || copiedCount > 0}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {isCopying 
                    ? `Copying... (${copiedCount}/${defaultExams.length})` 
                    : copiedCount > 0 
                    ? `Copied ${copiedCount} Exam${copiedCount === 1 ? '' : 's'}` 
                    : `Copy All ${defaultExams.length} Exam${defaultExams.length === 1 ? '' : 's'}`
                  }
                </Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Preview:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {defaultExams.map((exam, index) => (
                    <div key={exam.id} className="flex items-center gap-3 p-2 bg-background rounded border">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                        {index < copiedCount ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{exam.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {exam.createdAt?.toDate().toLocaleDateString() || "Unknown"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {copyError && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-md">
              <div className="text-sm text-destructive">
                Error copying exam: {copyError}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            {copiedCount > 0 ? "Done" : "Cancel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
