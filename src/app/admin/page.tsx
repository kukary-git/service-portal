import { createClient } from '@/utils/supabase/server'
import { signOut } from '../auth/actions'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: submissions, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching submissions:', error)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">{user.email}</span>
                            <form action={signOut}>
                                <button
                                    type="submit"
                                    className="text-sm font-medium text-red-600 hover:text-red-500"
                                >
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Recent Submissions
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Leads from the Service Portal contact form.
                            </p>
                        </div>
                        <div className="border-t border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Message
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {submissions?.map((submission) => (
                                            <tr key={submission.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(submission.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {submission.email}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {submission.message}
                                                </td>
                                            </tr>
                                        ))}
                                        {(!submissions || submissions.length === 0) && (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No submissions found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
