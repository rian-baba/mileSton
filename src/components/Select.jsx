import React, {useId} from 'react'

function Select({ 
    opitions,
    label,
    className="",
    ...props},ref) {
    
        const ID = useId()
  return (
    <div className='w-full'>
        {label && <label htmlFor={ID} className=''></label>}

        <select
        {...props}
        id={ID}
        ref={ref}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
        >
           {opitions?.map((opition) => {
            <option key={opition} value={opition}>
                {opition}
            </option>
           })}
        </select>
    </div>
  )
}

export default React.forwardRef(Select)