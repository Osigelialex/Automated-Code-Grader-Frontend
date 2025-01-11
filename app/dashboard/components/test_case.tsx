import React from 'react'
import { ITestCase } from '../interfaces/assignment'

export default function TestCase({ testCase }: { testCase: ITestCase }) {
  return (
    <div
    className="card bg-base-200"
    >
    <div className="card-body p-4">
      <div className="mb-3">
        <h4 className="font-semibold mb-2">
          Input:
        </h4>
        <pre className="bg-base-100 p-2 rounded-lg text-sm overflow-x-auto">
          {testCase.input}
        </pre>
      </div>
      <div>
        <h4 className="font-semibold mb-2">
          Expected Output:
        </h4>
        <pre className="bg-base-100 p-2 rounded-lg text-sm overflow-x-auto">
          {testCase.output}
        </pre>
      </div>
    </div>
  </div>
  )
}
