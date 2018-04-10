package cmcc.mobile.yiqi.vo;

import org.springframework.data.domain.AbstractPageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class MongoPageVo extends AbstractPageRequest {

	public MongoPageVo(int pageNo, int pageSize) {
		super(pageNo, pageSize);

	}

	@Override
	public int getOffset() {
		int pageNo = getPageNumber() > 0 ? getPageNumber() : 1;
		int pageSize = getPageSize() > 0 ? getPageSize() : 20;
		return (pageNo - 1) * pageSize;
	}

	@Override
	public Sort getSort() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Pageable next() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Pageable previous() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Pageable first() {
		// TODO Auto-generated method stub
		return null;
	}

}
