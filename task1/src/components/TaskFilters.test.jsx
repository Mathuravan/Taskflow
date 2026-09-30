import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import TaskFilters from './TaskFilters.jsx'

test('reports search text through the filter callback', () => {
  const onChange = vi.fn()
  render(
    <TaskFilters
      filters={{ search: '', status: '', priority: '' }}
      onChange={onChange}
      onClear={vi.fn()}
    />,
  )

  fireEvent.change(screen.getByLabelText('Search tasks'), { target: { value: 'internship' } })

  expect(onChange).toHaveBeenCalledWith({ search: 'internship' })
})
