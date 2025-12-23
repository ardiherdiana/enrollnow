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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mahasiswa',
        href: '/students',
    },
    {
        title: 'Edit Mahasiswa',
        href: '#',
    },
];

interface Student {
    id: number;
    student_id: string;
    name: string;
    email: string | null;
    phone: string | null;
    date_of_birth: string | null;
    address: string | null;
    status: string;
}

interface StudentsEditProps {
    student: Student;
}

export default function StudentsEdit({ student }: StudentsEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        student_id: student.student_id || '',
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        date_of_birth: student.date_of_birth || '',
        address: student.address || '',
        status: student.status || 'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/students/${student.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Mahasiswa" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href="/students">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Mahasiswa</h1>
                </div>

                <Card className="p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="student_id">NIM *</Label>
                                <Input
                                    id="student_id"
                                    value={data.student_id}
                                    onChange={(e) => setData('student_id', e.target.value)}
                                    required
                                    placeholder="Masukkan NIM"
                                />
                                <InputError message={errors.student_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="Masukkan nama lengkap"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">No. Telepon</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="081234567890"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
                                <DatePicker
                                    id="date_of_birth"
                                    value={data.date_of_birth}
                                    onChange={(value) => setData('date_of_birth', value)}
                                    placeholder="Pilih tanggal lahir"
                                />
                                <InputError message={errors.date_of_birth} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status *</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Aktif</SelectItem>
                                        <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                        <SelectItem value="graduated">Lulus</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Alamat</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Masukkan alamat"
                            />
                            <InputError message={errors.address} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Simpan
                            </Button>
                            <Link href="/students">
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

