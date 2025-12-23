import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Nilai', href: '/grades' }, { title: 'Detail Nilai' }];

interface Grade {
    id: number;
    class_standing: number | string;
    periodical_exam: number | string;
    period_grade: number | string;
    enrollment: {
        student: { name: string; student_id: string };
        subject: { name: string; code: string };
        period: { name: string };
    };
    period: {
        id: number;
        name: string;
        academic_year: string;
    };
}

interface GradesShowProps {
    grade: Grade;
    finalGrade?: number | null;
    p1Grade?: number | null;
    p2Grade?: number | null;
}

export default function GradesShow({ grade, finalGrade, p1Grade, p2Grade }: GradesShowProps) {
    const page = usePage();
    const auth = (page.props as any)?.auth;
    const isAdmin = auth?.user?.role === 'admin';
    const formatNumber = (value: number | string): string => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    const getGradeLetter = (score: number | string) => {
        const numScore = typeof score === 'string' ? parseFloat(score) : score;
        if (score >= 90) return 'A (4.00)';
        if (score >= 85) return 'A- (3.75)';
        if (score >= 80) return 'B+ (3.50)';
        if (score >= 70) return 'B (3.00)';
        if (score >= 65) return 'B- (2.75)';
        if (score >= 60) return 'C+ (2.50)';
        if (score >= 50) return 'C (2.00)';
        return 'D (1.00)';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Nilai" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/grades">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Detail Nilai</h1>
                    </div>
                    {isAdmin && (
                        <Link href={`/grades/${grade.id}/edit`}>
                            <Button>
                                <Edit className="size-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Informasi Enrollment</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Mahasiswa</p>
                                <p className="font-medium">
                                    {grade.enrollment.student.name} ({grade.enrollment.student.student_id})
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Mata Kuliah</p>
                                <p className="font-medium">
                                    {grade.enrollment.subject.name} ({grade.enrollment.subject.code})
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Periode</p>
                                <p className="font-medium">
                                    {grade.period?.name || grade.enrollment.period.name}
                                    {grade.period?.academic_year && ` - ${grade.period.academic_year}`}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Detail Nilai</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Class Standing (CS)</p>
                                <p className="font-medium text-xl">{formatNumber(grade.class_standing)}</p>
                                <p className="text-xs text-muted-foreground">Bobot: 60%</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Periodical Exam (PE)</p>
                                <p className="font-medium text-xl">{formatNumber(grade.periodical_exam)}</p>
                                <p className="text-xs text-muted-foreground">Bobot: 40%</p>
                            </div>
                            <div className="pt-3 border-t">
                                <p className="text-sm text-muted-foreground">Nilai Periode</p>
                                <p className="font-medium text-3xl">{formatNumber(grade.period_grade)}</p>
                                <p className="text-sm font-medium mt-2">
                                    {getGradeLetter(grade.period_grade)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Formula: (CS × 60%) + (PE × 40%)
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {finalGrade !== null && finalGrade !== undefined && p1Grade !== null && p2Grade !== null && (
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Final Grade</h2>
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 bg-muted rounded-md">
                                    <p className="text-sm text-muted-foreground">Nilai P1</p>
                                    <p className="font-medium text-2xl">{formatNumber(p1Grade)}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {getGradeLetter(p1Grade)}
                                    </p>
                                </div>
                                <div className="p-4 bg-muted rounded-md">
                                    <p className="text-sm text-muted-foreground">Nilai P2</p>
                                    <p className="font-medium text-2xl">{formatNumber(p2Grade)}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {getGradeLetter(p2Grade)}
                                    </p>
                                </div>
                            </div>
                            <div className="pt-4 border-t">
                                <p className="text-sm text-muted-foreground">Final Grade</p>
                                <p className="font-medium text-4xl">{formatNumber(finalGrade)}</p>
                                <p className="text-sm font-medium mt-2">
                                    {getGradeLetter(finalGrade)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Formula: (P1 × 50%) + (P2 × 50%)
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}


