import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Periode', href: '/periods' }];

interface Period {
    id: number;
    name: string;
    academic_year: string;
    semester: string;
    start_date: string;
    end_date: string;
    status: string;
}

interface PeriodsIndexProps {
    periods: { data: Period[]; links: any; meta: any };
    filters: { search?: string; status?: string };
}

export default function PeriodsIndex({ periods, filters }: PeriodsIndexProps) {
    const handleDelete = (id: number) => {
        if (confirm('Hapus periode ini?')) {
            router.delete(`/periods/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Periode" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Daftar Periode</h1>
                    <Link href="/periods/create"><Button><Plus className="size-4 mr-2" />Tambah Periode</Button></Link>
                </div>
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-semibold">Nama</th>
                                    <th className="text-left p-4 font-semibold">Tahun Ajaran</th>
                                    <th className="text-left p-4 font-semibold">Semester</th>
                                    <th className="text-left p-4 font-semibold">Status</th>
                                    <th className="text-right p-4 font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {periods.data.length > 0 ? (
                                    periods.data.map((period) => (
                                        <tr key={period.id} className="border-b hover:bg-accent/50">
                                            <td className="p-4 font-medium">{period.name}</td>
                                            <td className="p-4">{period.academic_year}</td>
                                            <td className="p-4">{period.semester}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    period.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {period.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/periods/${period.id}`}><Button variant="ghost" size="icon"><Eye className="size-4" /></Button></Link>
                                                    <Link href={`/periods/${period.id}/edit`}><Button variant="ghost" size="icon"><Edit className="size-4" /></Button></Link>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(period.id)}><Trash2 className="size-4 text-destructive" /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Tidak ada data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

