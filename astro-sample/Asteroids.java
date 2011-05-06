/*****************************************************
 * Cha pter 3 - ASTEROI DS GAME
 *****************************************************/
import java.applet.Applet;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.util.Random;

/*****************************************************
 * Primary class for the game
 *****************************************************/
public class Asteroids extends Applet implements Runnable, KeyListener {

    private static final long serialVersionUID = 9999999L;
    // the main thread becomes the game loop
    Thread gameloop;
    
    // use this as a double buffer
    BufferedImage backbuffer;
    
    // the main drawing object for the back buffer, this comes from a method on the backbuffer. 
    Graphics2D g2d;
    
    // toggle for drawing bounding boxes, very useful for debugging but didnt seem to work??
    boolean showBounds = true;

    // create the asteroid array
    int ASTEROIDS = 20;
    Asteroid[] ast = new Asteroid[ASTEROIDS];
    // create the bullet array
    int BULLETS = 10;
    Bullet[] bullet = new Bullet[BULLETS];
    int currentBullet = 0;

    // the player�s ship
    Ship ship = new Ship();
    
    // create the identity transform (0, 0)
    AffineTransform identity = new AffineTransform();
    
    // create a random number generator
    Random rand = new Random();

    /*This is used in place of the old integer directional system which results in much cleaner code. Keyboard input 
     * will change the facing angle +-5 degrees, then the velocity (movement) is computed. 
     * 45 degrees would end up with x=1 and y=0 
     * 17 degrees would be valocityX=.01 and valocityY=1.57 , this wouldn't immediately translate on screen but would add up over time esp @ 50fps
     * 
     * NOTE: wouldnt want everything to have velocity that carried past a turn in non-zero-g games 
     * because you wouldnt be able to stop a player/monster sprite. 
     * Velocity for missiles would be perfect though. and velocity would simulate speed if there isnt another way..
     * */
    /*****************************************************
     * calculate X movement value based on direction Angle
     *****************************************************/
    public double calcAngleMoveX(double angle) {
        return (Math.cos(angle * Math.PI / 180));
    }

    /*****************************************************
     * calculate Y movement value based on direction Angle
     *****************************************************/
    public double calAnglMoveY(double angle) {
        return (Math.sin(angle * Math.PI / 180));
    }

    /*****************************************************
     * applet init event
     *****************************************************/
    @Override
    public void init() {
        // create the back buffer for smooth graphics
        backbuffer = new BufferedImage(640, 480, BufferedImage.TYPE_INT_RGB);
        g2d = backbuffer.createGraphics();
        // set up the ship
        ship.setX(320);
        ship.setY(240);
        // set up the bullets
        for (int n = 0; n < BULLETS; n++) {
            bullet[n] = new Bullet();
        }
        // crea te the asteroi ds
        for (int n = 0; n < ASTEROIDS; n++) {
            ast[n] = new Asteroid();
            ast[n].setRotationVelocity(rand.nextInt(3) + 1);
            ast[n].setX((double) rand.nextInt(600) + 20);
            ast[n].setY((double) rand.nextInt(440) + 20);
            ast[n].setMoveAngle(rand.nextInt(360));
            double ang = ast[n].getMoveAngle() - 90;
            ast[n].setVelX(calcAngleMoveX(ang));

            ast[n].setVelY(calAnglMoveY(ang));
        }
        // start the user input listener
        addKeyListener(this);
    }

    /*****************************************************
     * appl et updat e event to redraw the screen
     *****************************************************/
    @Override
    public void update(Graphics g) {
        // start off transforms at identity
        g2d.setTransform(identity);
        // eras e the background
        g2d.setPaint(Color.BLACK);
        g2d.fillRect(0, 0, getSize().width, getSize().height);
        // print some status information
        g2d.setColor(Color.WHITE);
        g2d.drawString(" Ship: " + Math.round(ship.getX()) + " , " + Math.round(ship.getY()), 5, 10);
        g2d.drawString(" Move angle: " + Math.round(ship.getMoveAngle()) + 90, 5, 25);
        g2d.drawString(" Faceangle: " + Math.round(ship.getFaceAngle()), 5, 40);

        // draw the game graphics
        drawShip();
        drawBullets();
        drawAsteroids();
        // repaint the applet window
        paint(g);

    }


    /*****************************************************
     * drawShip called by applet update event
     *****************************************************/
    public void drawShip() {
        g2d.setTransform(identity);
        g2d.translate(ship.getX(), ship.getY());
        g2d.rotate(Math.toRadians(ship.getFaceAngle()));
        g2d.setColor(Color.ORANGE);
        g2d.fill(ship.getShape());

    }

    /*****************************************************
     * drawbullets called by applet update event
     *****************************************************/
    public void drawBullets() {
        // i terate t hrough the array of bullets
        for (int n = 0; n < BULLETS; n++) {
            // i s thi s bullet currentl y i n use?
            if (bullet[n].isAlive()) {
                // draw t he bullet
                g2d.setTransform(identity);
                g2d.translate(bullet[n].getX(), bullet[n].getY());
                g2d.setColor(Color.MAGENTA);
                g2d.draw(bullet[n].getShape());
            }
        }
    }


    /*****************************************************
     * dra wAsteroi ds cal l ed by appl et updat e event
     *****************************************************/
    public void drawAsteroids() {
        // i terate t hrough the ast eroi ds array
        for (int n = 0; n < ASTEROIDS; n++) {
            // is this asteroid being used?
            if (ast[n].isAlive()) {
                // draw t he asteroid
                g2d.setTransform(identity);
                g2d.translate(ast[n].getX(), ast[n].getY());
                g2d.rotate(Math.toRadians(ast[n].getMoveAngle()));
                g2d.setColor(Color.DARK_GRAY);
                g2d.fill(ast[n].getShape());
            }
        }
    }

    /*****************************************************
     * appl et wi ndow repaint event-- draw the back buffer
     *****************************************************/
    @Override
    public void paint(Graphics g) {
        // draw the back buffer on to the appl et wi ndow
        g.drawImage(backbuffer, 0, 0, this);
    }

    /*****************************************************
     * thread start event - s tart the game l oop runni ng
     *****************************************************/
    @Override
    public void start() {
        // crea te the gamel oop thread for real -t i me updates
        gameloop = new Thread(this);
        gameloop.start();
    }

    /*****************************************************
     * thread run event ( game l oop)
     *****************************************************/
    @Override
    public void run() {
        // acqui re t he current thread
        Thread t = Thread.currentThread();
        // keep goi ng as l ong as the thread i s Alive
        while (t == gameloop) {
            try {
                // updat e the game l oop
                gameUpdate();
                // t arget fra merat e i s 50 fps
                Thread.sleep(20);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            repaint();
        }
    }

    /*****************************************************
     * thread stop event
     *****************************************************/
    @Override
    public void stop() {
        // ki l l the gamel oop t hread
        gameloop = null;
    }

    /*****************************************************
     * move and ani mate t he object s i n the game
     *****************************************************/
    private void gameUpdate() {
        updateShip();
        updateBullets();
        updateAsteroids();
        checkCollisions();
    }

    /*****************************************************
     * Update the ship position based on velocity
     *****************************************************/
    public void updateShip() {
        // update ship�s X position
        ship.incX(ship.getVelX());
        // wrap around left/right
        if (ship.getX() < -10)
            ship.setX(getSize().width + 10);
        else if (ship.getX() > getSize().width + 10)
            ship.setX(-10);
        // update ship�s Y position
        ship.incY(ship.getVelY());

        // wrap around top/bottom
        if (ship.getY() < -10)
            ship.setY(getSize().height + 10);
        else if (ship.getY() > getSize().height + 10)
            ship.setY(-10);

    }

    /*****************************************************
     * Update the bullets based on velocity
     *****************************************************/
    public void updateBullets() {
        // move each of the bullets
        for (int n = 0; n < BULLETS; n++) {
            // i s thi s bullet bei ng used?
            if (bullet[n].isAlive()) {
                // updat e bullet� s x posi ti on
                bullet[n].incX(bullet[n].getVelX());
                // bullet di s appears at l eft/ri ght edge
                if (bullet[n].getX() < 0 || bullet[n].getX() > getSize().width) {
                    bullet[n].setAlive(false);
                }
                // updat e bullet� s y posi ti on
                bullet[n].incY(bullet[n].getVelY());
                // bullet di s appears at top/bott om edge
                if (bullet[n].getY() < 0 || bullet[n].getY() > getSize().height) {
                    bullet[n].setAlive(false);
                }
            }
        }
    }

    /*****************************************************
     * Update t he asteroi ds based on vel oci ty
     *****************************************************/
    public void updateAsteroids() {
        // move and rotat e the ast eroi ds
        for (int n = 0; n < ASTEROIDS; n++) {
            // i s thi s asteroi d bei ng used?
            if (ast[n].isAlive()) {
                // updat e the asteroi d� s X val ue
                ast[n].incX(ast[n].getVelX());
                // warp t he a steroi d at screen edges
                if (ast[n].getX() < -20)
                    ast[n].setX(getSize().width + 20);
                else if (ast[n].getX() > getSize().width + 20)
                    ast[n].setX(-20);
                // updat e the asteroi d� s Y val ue
                ast[n].incY(ast[n].getVelY());
                // warp t he a steroi d at screen edges
                if (ast[n].getY() < -20)
                    ast[n].setY(getSize().height + 20);
                else if (ast[n].getY() > getSize().height + 20)
                    ast[n].setY(-20);
                // updat e the asteroi d� s rotation
                ast[n].incMoveAngle(ast[n].getRotationVelocity());
                // keep t he a ngl e wi thi n 0- 359 degrees
                if (ast[n].getMoveAngle() < 0)
                    ast[n].setMoveAngle(360 - ast[n].getRotationVelocity());
                else if (ast[n].getMoveAngle() > 360)
                    ast[n].setMoveAngle(ast[n].getRotationVelocity());
            }
        }
    }

    /*****************************************************
     * Tes t ast eroids for col l i si ons wi th s hi p or bullets
     *****************************************************/
    public void checkCollisions() {
        // i terate t hrough the ast eroi ds array
        for (int m = 0; m < ASTEROIDS; m++) {
            // i s thi s asteroi d bei ng used?
            if (ast[m].isAlive()) {
                /*
                 * check for collisi on with bullet
                 */
                for (int n = 0; n < BULLETS; n++) {
                    // is thi s bullet bei ng used?
                    if (bullet[n].isAlive()) {
                        // perform the col l i si on tes t
                        if (ast[m].getBounds().contains(bullet[n].getX(), bullet[n].getY())) {
                            bullet[n].setAlive(false);
                            ast[m].setAlive(false);
                            continue;
                        }
                    }
                }
                /*
                 * check for collision with ship
                 */
                if (ast[m].getBounds().intersects(ship.getBounds())) {
                    ast[m].setAlive(false);
                    ship.setX(320);
                    ship.setY(240);
                    ship.setFaceAngle(0);
                    ship.setVelX(0);
                    ship.setVelY(0);
                    continue;

                }
            }

        }
    }

    
    

    /*****************************************************
     * key listener events
     *****************************************************/
    @Override
    public void keyReleased(KeyEvent k) {
    }

    @Override
    public void keyTyped(KeyEvent k) {
    }

    
    
    @Override
    public void keyPressed(KeyEvent k) {
        int keyCode = k.getKeyCode();
        switch (keyCode) {
            case KeyEvent.VK_LEFT:
                // left arrow rotates ship left 5 degrees
                ship.incFaceAngle(-5);
                if (ship.getFaceAngle() < 0)
                    ship.setFaceAngle(360 - 5);
                break;
            case KeyEvent.VK_RIGHT:
                // right arrow rotates ship right 5 degrees
                ship.incFaceAngle(5);
                if (ship.getFaceAngle() > 360)
                    ship.setFaceAngle(5);
                break;
            case KeyEvent.VK_UP:
                // up arrow adds thrust to ship ( 1/10 normal s peed)
                ship.setMoveAngle(ship.getFaceAngle() - 90);
                ship.incVelX(calcAngleMoveX(ship.getMoveAngle()) * 0.1);
                ship.incVelY(calAnglMoveY(ship.getMoveAngle()) * 0.1);
                break;

            // Ctrl , Ent er, or Space can be used to fi re weapon
            case KeyEvent.VK_CONTROL:
            case KeyEvent.VK_ENTER:

            case KeyEvent.VK_SPACE:
                // fire a bullet
                currentBullet++;
                if (currentBullet > BULLETS - 1)
                    currentBullet = 0;
                bullet[currentBullet].setAlive(true);
                // point bullet i n same di recti on shi p i s faci ng
                bullet[currentBullet].setX(ship.getX());
                bullet[currentBullet].setY(ship.getY());
                bullet[currentBullet].setMoveAngle(ship.getFaceAngle() - 90);
                // fi re bullet at Angle of the s hi p
                double Angle = bullet[currentBullet].getMoveAngle();
                double svx = ship.getVelX();
                double svy = ship.getVelY();
                bullet[currentBullet].setVelX(calcAngleMoveX(Angle) * 2);
                bullet[currentBullet].setVelY(calAnglMoveY(Angle) * 2);
                break;
                
            case KeyEvent.VK_R:
            	//reset astroids.
            	for (Asteroid a : this.ast) {
					a.setAlive(true);
				}
            	
            break;
        }
    }
}
