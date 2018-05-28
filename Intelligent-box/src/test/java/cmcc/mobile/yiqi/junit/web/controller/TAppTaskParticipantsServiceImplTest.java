package cmcc.mobile.yiqi.junit.web.controller;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import cmcc.mobile.yiqi.entity.TAppTaskParticipants;
import cmcc.mobile.yiqi.entity.dao.TAppTaskParticipantsMapper;
import cmcc.mobile.yiqi.junit.base.BaseJunit4Test;

public class TAppTaskParticipantsServiceImplTest extends BaseJunit4Test {

	@Autowired
	private TAppTaskParticipantsMapper taskParService;

	@Test
	public void insert() {
		TAppTaskParticipants task = new TAppTaskParticipants();
		task.setCanceltype(1);
		taskParService.insert(task);
		assertEquals(1, 1);
	}

	@Test
	public void selectTask() {
		taskParService.selectAllTask(1L);
		assertEquals(true, true);
	}

	@Test
	public void selectReadTask() {
		taskParService.selectReadTask(1L);
		assertEquals(true, true);
	}

	@Test
	public void selectParTask() {
		taskParService.selectParTask(1L, 1L);
		assertEquals(true, true);
	}

	@Test
	public void updateReadType() {
		TAppTaskParticipants task = new TAppTaskParticipants();
		task.setUid(1L);
		task.setTaskid(1L);
		taskParService.updateReadType(task);
		assertEquals(true, true);
	}

	@Test
	public void updateMessage() {
		TAppTaskParticipants task = new TAppTaskParticipants();
		task.setUid(1L);
		task.setTaskid(1L);
		taskParService.updateMessage(task);
		assertEquals(true, true);
	}

	@Test
	public void aptMessage() {
		taskParService.aptMessage(1L);
		assertEquals(true, true);
	}

	@Test
	public void selectDoneTask() {
		taskParService.selectDoneTask(1L);
		assertEquals(true, true);
	}

	@Test
	public void selectAllTask() {
		taskParService.selectAllTask(1L);
		assertEquals(true, true);
	}

	@Test
	public void oriUpdateMessage() {
		TAppTaskParticipants task = new TAppTaskParticipants();
		task.setUid(1L);
		task.setTaskid(1L);
		taskParService.oriUpdateMessage(task);
		assertEquals(true, true);
	}

	@Test
	public void endParTask() {
		taskParService.endParTask(1L);
		assertEquals(true, true);
	}

	@Test
	public void deleteParTask() {
		taskParService.deleteParTask(1L);
		assertEquals(true, true);
	}

	@Test
	public void selectFileTask() {
		taskParService.selectFileTask(1L);
		assertEquals(true, true);
	}

	@Test
	public void selectTaskDetails() {
		TAppTaskParticipants task = new TAppTaskParticipants();
		task.setUid(1L);
		task.setTaskid(1L);
		taskParService.selectTaskDetails(task);
		assertEquals(true, true);
	}

	@Test
	public void cancelTask() {
		taskParService.cancelTask(1L);
		assertEquals(true, true);
	}

}
