import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { SearchableSelect } from '@/components/ui/searchable-select';
import InputError from '@/components/input-error';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Nilai', href: '/grades' }, { title: 'Edit Nilai', href: '#' }];

interface Grade {
    id: number;
    enrollment_id: number;
    period_id?: number;
    class_standing: number;
    periodical_exam: number;
    period_grade: number;
    enrollment: {
        student: { name: string; student_id: string };
        subject: { name: string; code: string };
        period?: { name: string };
    };
    period?: {
        id: number;
        name: string;
        academic_year: string;
    };
}

interface Period {
    id: number;
    name: string;
    academic_year: string;
}

interface GradesEditProps {
    grade: Grade;
    periods: Period[];
}

export default function GradesEdit({ grade, periods }: GradesEditProps) {
    // Get period_id from grade.period_id or grade.period.id
    const getPeriodId = () => {
        if (grade.period_id) return grade.period_id.toString();
        if (grade.period?.id) return grade.period.id.toString();
        return '';
    };

    const { data, setData, put, processing, errors } = useForm({
        period_id: getPeriodId(),
        class_standing: grade.class_standing || 0,
        periodical_exam: grade.periodical_exam || 0,
    });

    // Handle number input to remove leading zeros
    const handleNumberChange = (field: 'class_standing' | 'periodical_exam', value: string) => {
        // If empty, set to 0
        if (value === '' || value === null || value === undefined) {
            setData(field, 0);
            return;
        }
        
        // Remove leading zeros (but keep single 0)
        let numValue = value.replace(/^0+(?=\d)/, '') || value;
        
        // If the value is just "0", keep it as 0
        if (numValue === '0') {
            setData(field, 0);
            return;
        }
        
        // Parse to number
        const parsed = parseFloat(numValue);
        if (!isNaN(parsed)) {
            // Clamp between 0 and 100
            const clamped = Math.max(0, Math.min(100, parsed));
            setData(field, clamped);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Nilai" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href="/grades">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Nilai</h1>
                </div>
                <Card className="p-6">
                    <div className="mb-6 p-4 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground">Enrollment</p>
                        <p className="font-medium">
                            {grade.enrollment?.student?.name || 'N/A'} - {grade.enrollment?.subject?.name || 'N/A'} ({grade.enrollment?.period?.name || grade.period?.name || 'N/A'})
                        </p>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); put(`/grades/${grade.id}`); }} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="period_id">Periode *</Label>
                            <SearchableSelect
                                id="period_id"
                                options={periods.map((period) => ({
                                    value: period.id.toString(),
                                    label: `${period.name} - ${period.academic_year}`,
                                }))}
                                value={data.period_id}
                                onValueChange={(value) => setData('period_id', value)}
                                placeholder="Pilih Periode"
                                searchPlaceholder="Cari periode..."
                            />
                            <InputError message={errors.period_id} />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="class_standing">Class Standing (CS) *</Label>
                                <Input
                                    id="class_standing"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={data.class_standing || ''}
                                    onChange={(e) => handleNumberChange('class_standing', e.target.value)}
                                    onFocus={(e) => {
                                        // Select all text when focused if value is 0
                                        if (data.class_standing === 0) {
                                            e.target.select();
                                        }
                                    }}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Nilai 0-100 (Bobot 60%)</p>
                                <InputError message={errors.class_standing} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="periodical_exam">Periodical Exam (PE) *</Label>
                                <Input
                                    id="periodical_exam"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={data.periodical_exam || ''}
                                    onChange={(e) => handleNumberChange('periodical_exam', e.target.value)}
                                    onFocus={(e) => {
                                        // Select all text when focused if value is 0
                                        if (data.periodical_exam === 0) {
                                            e.target.select();
                                        }
                                    }}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Nilai 0-100 (Bobot 40%)</p>
                                <InputError message={errors.periodical_exam} />
                            </div>
                        </div>
                        <div className="p-4 bg-muted rounded-md">
                            <p className="text-sm font-medium">Nilai Periode (Otomatis):</p>
                            <p className="text-2xl font-bold">
                                {((data.class_standing * 0.6) + (data.periodical_exam * 0.4)).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Formula: (CS × 60%) + (PE × 40%)
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Simpan
                            </Button>
                            <Link href="/grades">
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


