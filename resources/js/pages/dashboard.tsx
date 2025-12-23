import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
    Users, 
    BookOpen, 
    Calendar, 
    GraduationCap,
    TrendingUp,
    FileText
} from 'lucide-react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    ReferenceLine,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    stats: {
        total_students?: number;
        active_students?: number;
        total_subjects?: number;
        active_subjects?: number;
        total_periods?: number;
        active_periods?: number;
        total_enrollments?: number;
        total_grades?: number;
        my_grades?: number;
        my_enrollments?: number;
    };
    recent_students: Array<{
        id: number;
        student_id: string;
        name: string;
        status: string;
    }>;
    recent_subjects: Array<{
        id: number;
        code: string;
        name: string;
        status: string;
    }>;
    active_periods: Array<{
        id: number;
        name: string;
        academic_year: string;
        semester: string;
    }>;
    isAdmin?: boolean;
    enrollmentStats?: Array<{ month: string; count: number }>;
    studentStats?: Array<{ month: string; count: number }>;
    gradeStats?: Array<{ grade: string; count: number }>;
    enrollmentByPeriod?: Array<{ name: string; count: number }>;
}

export default function Dashboard({
    stats,
    recent_students,
    recent_subjects,
    active_periods,
    isAdmin = true,
    enrollmentStats = [],
    studentStats = [],
    gradeStats = [],
    enrollmentByPeriod = [],
}: DashboardProps) {
    const statCards = isAdmin ? [
        {
            title: 'Total Mahasiswa',
            value: stats.total_students || 0,
            active: stats.active_students,
            icon: Users,
            color: 'text-[#2563EB]',
            bgColor: 'bg-blue-50',
            link: '/students',
        },
        {
            title: 'Total Mata Kuliah',
            value: stats.total_subjects || 0,
            active: stats.active_subjects,
            icon: BookOpen,
            color: 'text-[#2563EB]',
            bgColor: 'bg-blue-50',
            link: '/subjects',
        },
        {
            title: 'Total Periode',
            value: stats.total_periods || 0,
            active: stats.active_periods,
            icon: Calendar,
            color: 'text-[#2563EB]',
            bgColor: 'bg-blue-50',
            link: '/periods',
        },
        {
            title: 'Total Enrollment',
            value: stats.total_enrollments || 0,
            icon: GraduationCap,
            color: 'text-[#2563EB]',
            bgColor: 'bg-blue-50',
            link: '/enrollments',
        },
        {
            title: 'Total Nilai',
            value: stats.total_grades || 0,
            icon: FileText,
            color: 'text-[#2563EB]',
            bgColor: 'bg-blue-50',
            link: '/grades',
        },
    ] : [
        {
            title: 'Nilai Saya',
            value: stats.my_grades || 0,
            icon: FileText,
            color: 'text-[#2563EB]',
            bgColor: 'bg-blue-50',
            link: '/grades',
        },
        {
            title: 'Enrollment Saya',
            value: stats.my_enrollments || 0,
            icon: GraduationCap,
            color: 'text-[#2563EB]',
            bgColor: 'bg-blue-50',
            link: '/grades',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Link key={stat.title} href={stat.link}>
                                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {stat.title}
                                            </p>
                                            <p className="text-2xl font-bold mt-1">
                                                {stat.value}
                                            </p>
                    </div>
                                        <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                            <Icon className={`${stat.color} size-6`} />
                    </div>
                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Charts Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    {isAdmin ? (
                        <>
                            {/* Enrollment Trend Chart */}
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Trend Enrollment (6 Bulan Terakhir)</h3>
                                    <GraduationCap className="text-[#2563EB] size-5" />
                                </div>
                                {enrollmentStats.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart 
                                            data={enrollmentStats}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorEnrollment" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                                            <XAxis 
                                                dataKey="month" 
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                stroke="#9ca3af"
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                stroke="#9ca3af"
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: '#fff', 
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    padding: '12px'
                                                }}
                                                labelStyle={{ 
                                                    color: '#1f2937',
                                                    fontWeight: 600,
                                                    marginBottom: '4px'
                                                }}
                                                itemStyle={{ color: '#2563EB', fontWeight: 500 }}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="count" 
                                                stroke="#2563EB" 
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorEnrollment)"
                                                dot={{ fill: '#2563EB', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                                activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff', fill: '#1d4ed8' }}
                                                name="Enrollment"
                                                animationDuration={800}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                        <p>Tidak ada data enrollment</p>
                                    </div>
                                )}
                            </Card> 

                            {/* Student Registration Trend Chart */}
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Registrasi Mahasiswa (6 Bulan Terakhir)</h3>
                                    <Users className="text-[#2563EB] size-5" />
                                </div>
                                {studentStats.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart 
                                            data={studentStats}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorStudent" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                                            <XAxis 
                                                dataKey="month" 
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                stroke="#9ca3af"
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                stroke="#9ca3af"
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: '#fff', 
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    padding: '12px'
                                                }}
                                                labelStyle={{ 
                                                    color: '#1f2937',
                                                    fontWeight: 600,
                                                    marginBottom: '4px'
                                                }}
                                                itemStyle={{ color: '#3b82f6', fontWeight: 500 }}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="count" 
                                                stroke="#3b82f6" 
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorStudent)"
                                                dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                                activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff', fill: '#2563eb' }}
                                                name="Mahasiswa Baru"
                                                animationDuration={800}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                        <p>Tidak ada data registrasi</p>
                                    </div>
                                )}
                            </Card>

                            {/* Grade Distribution Chart */}
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Distribusi Nilai Mahasiswa</h3>
                                    <FileText className="text-[#2563EB] size-5" />
                                </div>
                                {gradeStats.length > 0 && gradeStats.some(g => g.count > 0) ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart 
                                            data={gradeStats}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorGradeBar" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.9}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                                            <XAxis 
                                                dataKey="grade" 
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                stroke="#9ca3af"
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                stroke="#9ca3af"
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: '#fff', 
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    padding: '12px'
                                                }}
                                                labelStyle={{ 
                                                    color: '#1f2937',
                                                    fontWeight: 600,
                                                    marginBottom: '4px'
                                                }}
                                                itemStyle={{ color: '#60a5fa', fontWeight: 500 }}
                                            />
                                            <Bar 
                                                dataKey="count" 
                                                fill="url(#colorGradeBar)" 
                                                radius={[8, 8, 0, 0]}
                                                name="Jumlah Mahasiswa"
                                                animationDuration={800}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                        <p>Tidak ada data nilai</p>
                                    </div>
                                )}
                            </Card>

                            {/* Enrollment by Period Chart */}
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Enrollment per Periode</h3>
                                    <Calendar className="text-[#2563EB] size-5" />
                                </div>
                                {enrollmentByPeriod.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart 
                                            data={enrollmentByPeriod}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.9}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                                            <XAxis 
                                                dataKey="name" 
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                stroke="#9ca3af"
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                stroke="#9ca3af"
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: '#fff', 
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    padding: '12px'
                                                }}
                                                labelStyle={{ 
                                                    color: '#1f2937',
                                                    fontWeight: 600,
                                                    marginBottom: '4px'
                                                }}
                                                itemStyle={{ color: '#2563EB', fontWeight: 500 }}
                                            />
                                            <Bar 
                                                dataKey="count" 
                                                fill="url(#colorBar)" 
                                                radius={[8, 8, 0, 0]}
                                                name="Enrollment"
                                                animationDuration={800}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                        <p>Tidak ada data enrollment per periode</p>
                                    </div>
                                )}
                            </Card>
                        </>
                    ) : (
                        <>
                            {/* User Enrollment Trend Chart */}
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Enrollment Saya (6 Bulan Terakhir)</h3>
                                    <GraduationCap className="text-[#2563EB] size-5" />
                                </div>
                                {enrollmentStats.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart 
                                            data={enrollmentStats}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorUserEnrollment" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                                            <XAxis 
                                                dataKey="month" 
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                stroke="#9ca3af"
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                stroke="#9ca3af"
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: '#fff', 
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    padding: '12px'
                                                }}
                                                labelStyle={{ 
                                                    color: '#1f2937',
                                                    fontWeight: 600,
                                                    marginBottom: '4px'
                                                }}
                                                itemStyle={{ color: '#2563EB', fontWeight: 500 }}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="count" 
                                                stroke="#2563EB" 
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorUserEnrollment)"
                                                dot={{ fill: '#2563EB', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                                activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff', fill: '#1d4ed8' }}
                                                name="Enrollment"
                                                animationDuration={800}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                        <p>Belum ada enrollment</p>
                                    </div>
                                )}
                            </Card>

                            {/* User Grade Distribution Chart */}
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Distribusi Nilai Saya</h3>
                                    <FileText className="text-[#2563EB] size-5" />
                                </div>
                                {gradeStats.length > 0 && gradeStats.some(g => g.count > 0) ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart 
                                            data={gradeStats}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorUserGradeBar" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.7}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                                            <XAxis 
                                                dataKey="grade" 
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                stroke="#9ca3af"
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                stroke="#9ca3af"
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: '#fff', 
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    padding: '12px'
                                                }}
                                                labelStyle={{ 
                                                    color: '#1f2937',
                                                    fontWeight: 600,
                                                    marginBottom: '4px'
                                                }}
                                                itemStyle={{ color: '#3b82f6', fontWeight: 500 }}
                                            />
                                            <Bar 
                                                dataKey="count" 
                                                fill="url(#colorUserGradeBar)" 
                                                radius={[8, 8, 0, 0]}
                                                name="Jumlah Nilai"
                                                animationDuration={800}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                        <p>Belum ada nilai</p>
                                    </div>
                                )}
                            </Card>

                            {/* User Enrollment by Period Chart */}
                            {enrollmentByPeriod.length > 0 && (
                                <Card className="p-6 md:col-span-2">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold">Enrollment Saya per Periode</h3>
                                        <Calendar className="text-[#2563EB] size-5" />
                                    </div>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart 
                                            data={enrollmentByPeriod}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorUserBar" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.9}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                                            <XAxis 
                                                dataKey="name" 
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                stroke="#9ca3af"
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                stroke="#9ca3af"
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: '#fff', 
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    padding: '12px'
                                                }}
                                                labelStyle={{ 
                                                    color: '#1f2937',
                                                    fontWeight: 600,
                                                    marginBottom: '4px'
                                                }}
                                                itemStyle={{ color: '#2563EB', fontWeight: 500 }}
                                            />
                                            <Bar 
                                                dataKey="count" 
                                                fill="url(#colorUserBar)" 
                                                radius={[8, 8, 0, 0]}
                                                name="Enrollment"
                                                animationDuration={800}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            )}
                        </>
                    )}
                </div>

                {/* Recent Data - Only for Admin */}
                {isAdmin && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Recent Students */}
                    <Card className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Mahasiswa Terbaru</h3>
                            <Link href="/students">
                                <Button variant="ghost" size="sm">Lihat Semua</Button>
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {recent_students.length > 0 ? (
                                recent_students.map((student) => (
                                    <Link
                                        key={student.id}
                                        href={`/students/${student.id}`}
                                        className="block p-2 rounded-md hover:bg-accent transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm">{student.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {student.student_id}
                                                </p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                student.status === 'active' 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {student.status}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Belum ada mahasiswa
                                </p>
                            )}
                        </div>
                    </Card>

                    {/* Recent Subjects */}
                    <Card className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Mata Kuliah Terbaru</h3>
                            <Link href="/subjects">
                                <Button variant="ghost" size="sm">Lihat Semua</Button>
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {recent_subjects.length > 0 ? (
                                recent_subjects.map((subject) => (
                                    <Link
                                        key={subject.id}
                                        href={`/subjects/${subject.id}`}
                                        className="block p-2 rounded-md hover:bg-accent transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm">{subject.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {subject.code}
                                                </p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                subject.status === 'active' 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {subject.status}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Belum ada mata kuliah
                                </p>
                            )}
                        </div>
                    </Card>

                    {/* Active Periods */}
                    <Card className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Periode Aktif</h3>
                            <Link href="/periods">
                                <Button variant="ghost" size="sm">Lihat Semua</Button>
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {active_periods.length > 0 ? (
                                active_periods.map((period) => (
                                    <Link
                                        key={period.id}
                                        href={`/periods/${period.id}`}
                                        className="block p-2 rounded-md hover:bg-accent transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">{period.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {period.academic_year} - {period.semester}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Belum ada periode aktif
                                </p>
                            )}
                        </div>
                    </Card>
                </div>
                )}
            </div>
        </AppLayout>
    );
}
