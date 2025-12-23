import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Enrollment', href: '/enrollments' }, { title: 'Edit Enrollment' }];

interface Enrollment {
    id: number;
    student_id: number;
    subject_id: number;
    period_id: number;
    status: string;
    student: { name: string; student_id: string };
    subject: { name: string; code: string };
    period: { name: string };
}

interface EnrollmentsEditProps {
    enrollment: Enrollment;
    students: Array<{ id: number; name: string; student_id: string }>;
    subjects: Array<{ id: number; name: string; code: string }>;
    periods: Array<{ id: number; name: string }>;
}

export default function EnrollmentsEdit({ enrollment, students, subjects, periods }: EnrollmentsEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        student_id: enrollment.student_id.toString(),
        subject_id: enrollment.subject_id.toString(),
        period_id: enrollment.period_id.toString(),
        status: enrollment.status || 'enrolled',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Enrollment" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href="/enrollments">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Enrollment</h1>
                </div>
                <Card className="p-6">
                    <form onSubmit={(e) => { e.preventDefault(); put(`/enrollments/${enrollment.id}`); }} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="student_id">Mahasiswa *</Label>
                                <SearchableSelect
                                    id="student_id"
                                    options={students.map((student) => ({
                                        value: student.id.toString(),
                                        label: `${student.name} (${student.student_id})`,
                                    }))}
                                    value={data.student_id}
                                    onValueChange={(value) => setData('student_id', value)}
                                    placeholder="Pilih Mahasiswa"
                                    searchPlaceholder="Cari mahasiswa..."
                                />
                                <InputError message={errors.student_id} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject_id">Mata Kuliah *</Label>
                                <SearchableSelect
                                    id="subject_id"
                                    options={subjects.map((subject) => ({
                                        value: subject.id.toString(),
                                        label: `${subject.name} (${subject.code})`,
                                    }))}
                                    value={data.subject_id}
                                    onValueChange={(value) => setData('subject_id', value)}
                                    placeholder="Pilih Mata Kuliah"
                                    searchPlaceholder="Cari mata kuliah..."
                                />
                                <InputError message={errors.subject_id} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="period_id">Periode *</Label>
                                <SearchableSelect
                                    id="period_id"
                                    options={periods.map((period) => ({
                                        value: period.id.toString(),
                                        label: period.name,
                                    }))}
                                    value={data.period_id}
                                    onValueChange={(value) => setData('period_id', value)}
                                    placeholder="Pilih Periode"
                                    searchPlaceholder="Cari periode..."
                                />
                                <InputError message={errors.period_id} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status *</Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="enrolled">Enrolled</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="dropped">Dropped</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Simpan
                            </Button>
                            <Link href="/enrollments">
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}


