import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { ArrowLeft, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pilih Mata Kuliah', href: '/student/enrollments/create' }
];

interface StudentEnrollmentsCreateProps {
    students: Array<{ id: number; name: string; student_id: string }>;
    subjects: Array<{ id: number; name: string; code: string }>;
    periods: Array<{ id: number; name: string; academic_year: string }>;
    isAdmin?: boolean;
    existingEnrollments?: Array<{ period_id: number; subject_id: number }>;
}

export default function StudentEnrollmentsCreate({ students, subjects, periods, isAdmin = false, existingEnrollments = [] }: StudentEnrollmentsCreateProps) {
    // Auto-select student if only one (for regular users)
    const defaultStudentId = students.length === 1 ? students[0].id.toString() : '';

    const [searchSubject, setSearchSubject] = useState('');

    // Auto-select latest period (first in the sorted list)
    const defaultPeriodId = periods.length > 0 ? periods[0].id.toString() : '';

    const { data, setData, post, processing, errors } = useForm({
        student_id: defaultStudentId,
        subject_ids: [] as string[],
        period_id: defaultPeriodId,
        status: 'enrolled',
    });

    // Ensure period_id is set when periods are loaded
    useEffect(() => {
        if (!data.period_id && defaultPeriodId) {
            setData('period_id', defaultPeriodId);
        }
    }, [defaultPeriodId, data.period_id, setData]);

    const handleSubjectToggle = (subjectId: string) => {
        const currentIds = data.subject_ids || [];
        if (currentIds.includes(subjectId)) {
            setData('subject_ids', currentIds.filter(id => id !== subjectId));
        } else {
            setData('subject_ids', [...currentIds, subjectId]);
        }
    };

    // Check if subject is already enrolled for selected period
    const isSubjectEnrolled = (subjectId: string) => {
        if (!data.period_id) return false;
        return existingEnrollments.some(
            (enrollment) => 
                enrollment.period_id.toString() === data.period_id && 
                enrollment.subject_id.toString() === subjectId
        );
    };

    const filteredSubjects = subjects.filter(subject => {
        if (!searchSubject) return true;
        const searchLower = searchSubject.toLowerCase();
        return subject.name.toLowerCase().includes(searchLower) || 
               subject.code.toLowerCase().includes(searchLower);
    });

    // Check if there are any available subjects (not all are enrolled)
    const availableSubjects = filteredSubjects.filter(subject => !isSubjectEnrolled(subject.id.toString()));
    const hasAvailableSubjects = availableSubjects.length > 0;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.subject_ids.length === 0) {
            return;
        }
        post('/student/enrollments');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pilih Mata Kuliah" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={isAdmin ? "/enrollments" : "/student/enrollments"}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Pilih Mata Kuliah</h1>
                </div>
                <Card className="p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="period_id">Periode *</Label>
                                <SearchableSelect
                                    id="period_id"
                                    options={periods.map((period) => ({
                                        value: period.id.toString(),
                                        label: `${period.name} (${period.academic_year})`,
                                    }))}
                                    value={data.period_id}
                                    onValueChange={(value) => {
                                        setData('period_id', value);
                                        // Clear selected subjects when period changes
                                        setData('subject_ids', []);
                                    }}
                                    placeholder="Pilih Periode"
                                    searchPlaceholder="Cari periode..."
                                />
                                <InputError message={errors.period_id} />
                            </div>
                            {isAdmin && students.length > 1 && (
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
                            )}
                            {!isAdmin && students.length > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="student_id">Mahasiswa</Label>
                                    <div className="p-3 bg-muted rounded-md">
                                        <p className="font-medium">
                                            {students[0].name} ({students[0].student_id})
                                        </p>
                                    </div>
                                    <input type="hidden" value={data.student_id} />
                                </div>
                            )}
                            <div className="space-y-2 md:col-span-2">
                                <Label>Mata Kuliah *</Label>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                                        <Input
                                            type="text"
                                            placeholder="Cari mata kuliah..."
                                            value={searchSubject}
                                            onChange={(e) => setSearchSubject(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    <div className="border rounded-md p-4 max-h-[400px] overflow-y-auto">
                                        {filteredSubjects.length > 0 ? (
                                            <div className="space-y-3">
                                                {filteredSubjects.map((subject) => {
                                                    const isChecked = data.subject_ids?.includes(subject.id.toString());
                                                    const isEnrolled = isSubjectEnrolled(subject.id.toString());
                                                    return (
                                                        <div 
                                                            key={subject.id} 
                                                            className={`flex items-start space-x-3 ${isEnrolled ? 'opacity-60' : ''}`}
                                                        >
                                                            <Checkbox
                                                                id={`subject-${subject.id}`}
                                                                checked={isChecked || isEnrolled}
                                                                disabled={isEnrolled}
                                                                onCheckedChange={() => {
                                                                    if (!isEnrolled) {
                                                                        handleSubjectToggle(subject.id.toString());
                                                                    }
                                                                }}
                                                                className={isEnrolled ? 'bg-gray-300 border-gray-400 cursor-not-allowed' : ''}
                                                            />
                                                            <Label
                                                                htmlFor={`subject-${subject.id}`}
                                                                className={`flex-1 font-normal ${isEnrolled ? 'cursor-not-allowed text-muted-foreground' : 'cursor-pointer'}`}
                                                            >
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {subject.name}
                                                                        {isEnrolled && <span className="ml-2 text-xs text-muted-foreground">(Sudah terdaftar)</span>}
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">{subject.code}</p>
                                                                </div>
                                                            </Label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground text-center py-4">
                                                Tidak ada mata kuliah ditemukan
                                            </p>
                                        )}
                                    </div>
                                    {data.subject_ids && data.subject_ids.length > 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            {data.subject_ids.length} mata kuliah dipilih
                                        </p>
                                    )}
                                </div>
                                <InputError message={errors.subject_ids} />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button 
                                type="submit" 
                                disabled={processing || !data.period_id || (data.subject_ids?.length || 0) === 0}
                            >
                                Daftar Mata Kuliah {data.subject_ids && data.subject_ids.length > 0 && `(${data.subject_ids.length})`}
                            </Button>
                            <Link href={isAdmin ? "/enrollments" : "/student/enrollments"}>
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </Link>
                        </div>
                        {data.subject_ids && data.subject_ids.length === 0 && hasAvailableSubjects && (
                            <p className="text-sm text-destructive">
                                Pilih minimal satu mata kuliah
                            </p>
                        )}
                        {!hasAvailableSubjects && data.subject_ids && data.subject_ids.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Semua mata kuliah sudah terdaftar untuk periode ini
                            </p>
                        )}
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}

