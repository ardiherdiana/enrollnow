import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mahasiswa',
        href: '/students',
    },
    {
        title: 'Detail Mahasiswa',
        href: '#',
    },
];

interface Enrollment {
    id: number;
    status: string;
    subject: {
        code: string;
        name: string;
    };
    period: {
        name: string;
        academic_year: string;
    };
    grade: {
        class_standing: number;
        periodical_exam: number;
        period_grade: number;
    } | null;
}

interface Student {
    id: number;
    student_id: string;
    name: string;
    email: string | null;
    phone: string | null;
    date_of_birth: string | null;
    address: string | null;
    status: string;
    enrollments: Enrollment[];
}

interface StudentsShowProps {
    student: Student;
}

export default function StudentsShow({ student }: StudentsShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Mahasiswa" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/students">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Detail Mahasiswa</h1>
                    </div>
                    <Link href={`/students/${student.id}/edit`}>
                        <Button>
                            <Edit className="size-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Informasi Pribadi</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">NIM</p>
                                <p className="font-medium">{student.student_id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                                <p className="font-medium">{student.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{student.email || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">No. Telepon</p>
                                <p className="font-medium">{student.phone || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tanggal Lahir</p>
                                <p className="font-medium">
                                    {student.date_of_birth 
                                        ? new Date(student.date_of_birth).toLocaleDateString('id-ID')
                                        : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Alamat</p>
                                <p className="font-medium">{student.address || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                                    student.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : student.status === 'graduated'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {student.status === 'active' ? 'Aktif' :
                                     student.status === 'graduated' ? 'Lulus' : 'Tidak Aktif'}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Enrollment & Nilai</h2>
                        <div className="space-y-3">
                            {student.enrollments.length > 0 ? (
                                student.enrollments.map((enrollment) => (
                                    <div key={enrollment.id} className="border-b pb-3 last:border-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {enrollment.subject.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {enrollment.subject.code} - {enrollment.period.name}
                                                </p>
                                                {enrollment.grade && (
                                                    <div className="mt-2 text-sm">
                                                        <p>CS: {typeof enrollment.grade.class_standing === 'string' 
                                                            ? parseFloat(enrollment.grade.class_standing).toFixed(2)
                                                            : enrollment.grade.class_standing.toFixed(2)} | 
                                                           PE: {typeof enrollment.grade.periodical_exam === 'string'
                                                            ? parseFloat(enrollment.grade.periodical_exam).toFixed(2)
                                                            : enrollment.grade.periodical_exam.toFixed(2)} | 
                                                           Nilai: {typeof enrollment.grade.period_grade === 'string'
                                                            ? parseFloat(enrollment.grade.period_grade).toFixed(2)
                                                            : enrollment.grade.period_grade.toFixed(2)}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                enrollment.status === 'completed' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : enrollment.status === 'dropped'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {enrollment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada enrollment
                                </p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

