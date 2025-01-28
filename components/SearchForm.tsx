import Form from 'next/form'
import { SearchFormReset } from './SearchFormReset'
import { Search } from 'lucide-react'

const SearchForm = ({query}: {query?: string}) => {
  return (
    <Form action="/" scroll={false} className="search-form">
    <input
      name="query"
      defaultValue={query}
      className='search-input truncate'
      placeholder='Recherche des projets, ton Batch ou une Formation'
    />
    <div className="flex gap-2">
      { query && (<SearchFormReset />
      )}
    </div>

    <button type="submit" className="search-btn text-white">
          <Search className='size-5'/>
    </button>
  </Form>
  )
}

export default SearchForm
