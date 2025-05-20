import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit2, Copy, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface Workflow {
  id: string;
  name: string;
  description: string;
  created_at: number;
  updated_at: number;
}

export const Workflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows');
      if (!response.ok) throw new Error('Failed to fetch workflows');
      const data = await response.json();
      setWorkflows(data.workflows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete workflow');
      
      setWorkflows(workflows.filter(w => w.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workflow');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/workflows/${id}/duplicate`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to duplicate workflow');
      
      const newWorkflow = await response.json();
      setWorkflows([...workflows, newWorkflow]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate workflow');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Workflows</h1>
        <Button
          onClick={() => navigate('/dashboard')}
          variant="primary"
        >
          Create New Workflow
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="flex flex-col">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {workflow.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {workflow.description}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Created: {new Date(workflow.created_at).toLocaleDateString()}
                <br />
                Updated: {new Date(workflow.updated_at).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/dashboard?workflow=${workflow.id}`)}
                  leftIcon={<Edit2 size={16} />}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicate(workflow.id)}
                  leftIcon={<Copy size={16} />}
                >
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(workflow.id)}
                  className="text-red-600 hover:text-red-700"
                  leftIcon={<Trash2 size={16} />}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {workflows.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No workflows found. Create your first workflow to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};