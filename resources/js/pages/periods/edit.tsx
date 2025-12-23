import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import InputError from '@/components/input-error';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Periode', href: '/periods' }, { title: 'Edit Periode' }];

interface Period {
    id: number;
    name: string;
    academic_year: string;
    semester: string;
    start_date: string;
    end_date: string;
    status: string;
}

interface PeriodsEditProps {
    period: Period;
}

export default function PeriodsEdit({ period }: PeriodsEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: period.name || '',
        academic_year: period.academic_year || '',
        semester: period.semester || '',
        start_date: period.start_date || '',
        end_date: period.end_date || '',
        status: period.status || 'upcoming',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Periode" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href="/periods"><Button variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button></Link>
                    <h1 className="text-2xl font-bold">Edit Periode</h1>
                </div>
                <Card className="p-6">
                    <form onSubmit={(e) => { e.preventDefault(); put(`/periods/${period.id}`); }} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2"><Label htmlFor="name">Nama *</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required /><InputError message={errors.name} /></div>
                            <div className="space-y-2"><Label htmlFor="academic_year">Tahun Ajaran *</Label><Input id="academic_year" value={data.academic_year} onChange={(e) => setData('academic_year', e.target.value)} required /><InputError message={errors.academic_year} /></div>
                            <div className="space-y-2"><Label htmlFor="semester">Semester *</Label><Input id="semester" value={data.semester} onChange={(e) => setData('semester', e.target.value)} required /><InputError message={errors.semester} /></div>
                            <div className="space-y-2"><Label htmlFor="start_date">Tanggal Mulai *</Label><DatePicker id="start_date" value={data.start_date} onChange={(value) => setData('start_date', value)} placeholder="Pilih tanggal mulai" required /><InputError message={errors.start_date} /></div>
                            <div className="space-y-2"><Label htmlFor="end_date">Tanggal Selesai *</Label><DatePicker id="end_date" value={data.end_date} onChange={(value) => setData('end_date', value)} placeholder="Pilih tanggal selesai" required /><InputError message={errors.end_date} /></div>
                            <div className="space-y-2"><Label htmlFor="status">Status *</Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="upcoming">Upcoming</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>Simpan</Button>
                            <Link href="/periods"><Button type="button" variant="outline">Batal</Button></Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}

