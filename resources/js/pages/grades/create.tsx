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
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Nilai', href: '/grades' }, { title: 'Tambah Nilai' }];

interface Enrollment {
    id: number;
    student: { name: string; student_id: string };
    subject: { name: string; code: string };
    period: { id: number; name: string };
}

interface Period {
    id: number;
    name: string;
    academic_year: string;
}

interface GradesCreateProps {
    enrollments: Enrollment[];
    periods: Period[];
}

export default function GradesCreate({ enrollments, periods }: GradesCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        enrollment_id: '',
        period_id: '',
        class_standing: 0,
        periodical_exam: 0,
    });

    // Get selected enrollment to auto-fill period_id
    const selectedEnrollment = enrollments.find(e => e.id.toString() === data.enrollment_id);
    
    React.useEffect(() => {
        if (selectedEnrollment) {
            setData('period_id', selectedEnrollment.period.id.toString());
        }
    }, [data.enrollment_id, selectedEnrollment, setData]);

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
            <Head title="Tambah Nilai" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href="/grades">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Tambah Nilai</h1>
                </div>
                <Card className="p-6">
                    <form onSubmit={(e) => { e.preventDefault(); post('/grades'); }} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="enrollment_id">Enrollment *</Label>
                            <SearchableSelect
                                id="enrollment_id"
                                options={enrollments.map((enrollment) => ({
                                    value: enrollment.id.toString(),
                                    label: `${enrollment.student.name} - ${enrollment.subject.name} (${enrollment.period.name})`,
                                }))}
                                value={data.enrollment_id}
                                onValueChange={(value) => {
                                    setData('enrollment_id', value);
                                    // Auto-fill period_id from selected enrollment
                                    const enrollment = enrollments.find(e => e.id.toString() === value);
                                    if (enrollment) {
                                        setData('period_id', enrollment.period.id.toString());
                                    }
                                }}
                                placeholder="Pilih Enrollment"
                                searchPlaceholder="Cari enrollment..."
                            />
                            <InputError message={errors.enrollment_id} />
                            {selectedEnrollment && (
                                <p className="text-xs text-muted-foreground">
                                    Periode: {selectedEnrollment.period.name} - {selectedEnrollment.period.academic_year || ''}
                                </p>
                            )}
                        </div>
                        <input type="hidden" name="period_id" value={data.period_id} />
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
                        {data.class_standing > 0 && data.periodical_exam > 0 && (
                            <div className="p-4 bg-muted rounded-md">
                                <p className="text-sm font-medium">Nilai Periode (Otomatis):</p>
                                <p className="text-2xl font-bold">
                                    {((data.class_standing * 0.6) + (data.periodical_exam * 0.4)).toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Formula: (CS × 60%) + (PE × 40%)
                                </p>
                            </div>
                        )}
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


